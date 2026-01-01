import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { MessageService } from "../messages/messages.services";

export class MessageController {
  static async send(req: AuthRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { content } = req.body;
      
      const message = await MessageService.sendMessage(
        requestId,
        req.user!.userId,
        content
      );
      
      res.status(201).json(message);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const messages = await MessageService.getMessages(requestId, req.user!.userId);
      res.json(messages);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  }
}