import {Response} from "express";
import { RequestService } from "./request.service.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";


export class RequestController {
  static async create(req: AuthRequest, res:Response){
    const request = await RequestService.createRequest (
      req.user!.userId
    )
    res.status(201).json(request);
  }

  static async transition(req: AuthRequest, res:Response){
    const {id} = req.params;
    const {status} = req.body;

    const updated = await RequestService.transistionRequest(
      id,
      req.user!.userId,
      req.user!.role as "USER" | "EXPERT",
      status
    )
    res.json(updated)
  }
}