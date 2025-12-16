import prisma from "../../config/prisma.js"
import { RequestStatus } from "@prisma/client"
import { allowedTransitions } from "./request.state.js"

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

        return txt.supportRequest.update({
          where: {id: requestedId},
          data:{
            status:nextStatus,
            expertId:nextStatus === "ACCEPTED" ? userId :request.expertId,
            acceptedAt: nextStatus === "ACCEPTED" ? new Date() : request.acceptedAt,
            closedAt: nextStatus === 'ACCEPTED' ? new Date() : request.closedAt
          }
        })
    })
  }
}