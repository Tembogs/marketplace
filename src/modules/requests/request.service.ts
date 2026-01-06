import prisma from "../../config/prisma"
import { RequestStatus } from "@prisma/client"
import { allowedTransitions } from "./request.state"


export class RequestService{
  static async createRequest(userId: string) {
    return prisma.supportRequest.create({
      data: {
        userId,
        status:"REQUESTED"
      }
    })
  }


  static async transistionRequest(
    requestedId: string,
    userId:string,
    role: 'USER' | "EXPERT",
    nextStatus: RequestStatus
  ) {
    return prisma.$transaction(async (txt) => {
      const request = await txt.supportRequest.findUnique({
        where: {id: requestedId}
      })
      if (!request) throw new Error("Request not found")

        // validating status
        const allowed = allowedTransitions[request.status];
        if(!allowed.includes(nextStatus)){
          throw new Error(
            `Invalid status from ${request.status} to ${nextStatus}`
          )
        }

        // rules regarding roles
        if (nextStatus === "ACCEPTED" && role !== "EXPERT") {
          throw new Error("Only experts can accept requests"); 
        }

        if (nextStatus === "CLOSED" && !["USER", "EXPERT"].includes (role)){
          throw new Error("Unauthorised to close request");
        }

        const updatedRequest = txt.supportRequest.update({
          where: {id: requestedId},
          data:{
            status:nextStatus,
            expertId:nextStatus === "ACCEPTED" 
                      ? userId 
                      :request.expertId,
            
            acceptedAt: nextStatus === "ACCEPTED" 
                          ? new Date() 
                          : request.acceptedAt,
            
            closedAt: nextStatus === 'CLOSED' 
                          ? new Date() 
                          : request.closedAt
          }
        })

        // making the expert available after chat closed

        if(
          nextStatus === "CLOSED" && request?.expertId
        ){
          await txt.expertProfile.update({
            where:{userId: request.expertId},
            data:{isAvailable: true}
          })
        }
        return updatedRequest
    })
  }

  // expert seeing request
  static async getOpenRequests() {
  return prisma.supportRequest.findMany({
    where: { 
      status: "REQUESTED",
      expertId: null 
    },
    include: {
      user: { select: { email: true } } // Show who needs help
    }
  });
}

static async acceptRequest(requestId: string, expertId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Check if the request is still available
    const request = await tx.supportRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.status !== "REQUESTED") {
      throw new Error("Request is no longer available");
    }

    // 2. Assign the expert and update status
    const updated = await tx.supportRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPTED",
        expertId: expertId,
        acceptedAt: new Date()
      }
    });

    // 3. Set the expert to "Busy"
    await tx.expertProfile.upsert({
      where: { userId: expertId },
      update: { isAvailable: false },
      create: { 
        userId: expertId, 
        isAvailable: false,
        bio: "New Expert" // Provide defaults for required fields
      }
});

    return updated;
  });
}

static async rejectRequest(requestId: string) {
  return prisma.supportRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" }
  });
}

static async closeRequest(requestId: string, expertId: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.supportRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || (request.status !== "ACCEPTED" && request.status !== "ACTIVE")) {
      throw new Error("Request cannot be closed");
    }

    // Update the request
    const updated = await tx.supportRequest.update({
      where: { id: requestId },
      data: {
        status: "CLOSED",
        closedAt: new Date()
      }
    });

    // Make the expert available again!
    await tx.expertProfile.update({
      where: { userId: expertId },
      data: { isAvailable: true }
    });

    return updated;
  });
}

static async getAcceptedRequests(userId?: string, role?: string,) {
    return prisma.supportRequest.findMany({
      where: {
        status: "ACCEPTED",
        // If a userId is provided, filter by their role
        ...(userId && role === "USER" ? { userId } : {}),
        ...(userId && role === "EXPERT" ? { expertId: userId } : {}),
      },
      include: {
        user: { select: { email: true } },
        expert: { select: { email: true } },
      },
      orderBy: {
        acceptedAt: 'desc' // Most recent first
      }
    });
  }


  static async getClosedRequests(userId?: string, role?: string,) {
    return prisma.supportRequest.findMany({
      where: {
        status: "CLOSED",
        // If a userId is provided, filter by their role
        ...(userId && role === "USER" ? { userId } : {}),
        ...(userId && role === "EXPERT" ? { expertId: userId } : {}),
      },
      include: {
        user: { select: { email: true } },
        expert: { select: { email: true } },
      },
      orderBy: {
        closedAt: 'desc' // Most recent first
      }
    });
  }
}