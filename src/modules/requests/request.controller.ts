import {Response} from "express";
import { RequestService } from "./request.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { MatchingService } from "../matching/matching.service";

export class RequestController {
  static async create(req: AuthRequest, res:Response){
    try {
      const request = await RequestService.createRequest (
      req.user!.userId
    )
    try {
      const assignedRequest = await MatchingService.assignExpertToRequest(request.id)
      return res.status(201).json(assignedRequest);
    } catch (Matcherror) {
      return  res.status(201).json(request);
    }
    } catch (error: any) {
     return res.status(500).json({message: error.message}) 
    }
   
  }

  static async transition(req: AuthRequest, res:Response){
    const {id} = req.params;
    const {status} = req.body;

    const updated = await RequestService.transitionRequest(
      id,
      req.user!.userId,
      req.user!.role as "USER" | "EXPERT",
      status
    )
    res.json(updated)
  }

  // expert getting requests
  static async getPending(req: AuthRequest, res: Response) {
  const requests = await RequestService.getOpenRequests();
  res.json(requests);
}

static async accept(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updated = await RequestService.acceptRequest(id, req.user!.userId);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

static async close(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updated = await RequestService.closeRequest(id, req.user!.userId);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
static async reject(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const updated = await RequestService.rejectRequest(id);
  res.json(updated);
}

// getting accepted request
static async getAccepted(req: AuthRequest, res: Response) {
    try {
      const requests = await RequestService.getAcceptedRequests(
        req.user!.userId,
        req.user!.role
      );
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getClosed(req: AuthRequest, res: Response) {
    try {
      const requests = await RequestService.getClosedRequests(
        req.user!.userId,
        req.user!.role
      );
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}