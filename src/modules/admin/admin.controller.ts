import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { RequestStatus } from "@prisma/client";
import prisma from "../../config/prisma";

export class AdminController {
  // having access to request

  static async listRequests(req: AuthRequest, res: Response) {
    const {status, userId, expertId} = req.query

    const requests = await prisma.supportRequest.findMany ({
      where: {
        ...(status && {status: status as RequestStatus}),
        ...(userId && {userId: userId as string}),
        ...(expertId && {expertId: expertId as string})},
      
      include: {
        user: true,
        expert: true,
        messages:true},

      orderBy:{createdAt: "desc"}  
    });
    res.json(requests)
  }

  // can force-close a request
  static async closeRequests(req: AuthRequest, res: Response){
    const {id} = req.params;

    const request = await prisma.supportRequest.update({
      where: {id},
      data: {
        status: RequestStatus.CLOSED,
        closedAt: new Date()
      }
    })

    // can release expert if choosen

    if(request.expertId){
      await prisma.expertProfile.update({
        where: { userId: request.expertId},
        data:{isAvailable: true}
      })
    }
      res.json(request);
  }

  // see all the expert stats
    static async expertStats(req: AuthRequest, res:Response){
      const stats = await prisma.expertProfile.findMany({
        include: {
          user:{
            include:{
              assigned:true
            }
          }
        }
      })

      const result = stats.map((expert) => ({
        expertId: expert.userId,
        name: expert.user.email,
        totalSessions: expert.user.assigned.length,
        available: expert.isAvailable,
        rating: expert.rating
      }))
      res.json(result)
    }
}