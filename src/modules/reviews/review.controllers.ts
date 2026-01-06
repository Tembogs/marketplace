import { Request, Response } from "express";
import { ReviewService } from "./review.services";

export class ReviewController {
  static async addReview(req: any, res: Response) {
    try {
      const { requestId, rating, comment } = req.body;
      const userId = req.user.userId; 

      const review = await ReviewService.createReview(
        userId,
        requestId,
        rating,
        comment
      );

      return res.status(201).json({
        success: true,
        data: review
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}