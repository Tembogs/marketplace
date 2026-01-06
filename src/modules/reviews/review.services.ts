import prisma from "../../config/prisma";

export class ReviewService {
  static async createReview(userId: string, requestId: string, rating: number, comment?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Verify the request (Use 'tx' instead of 'prisma')
      const request = await tx.supportRequest.findUnique({
        where: { id: requestId }
      });

      if (!request) throw new Error("Support request not found");
      if (request.status !== "CLOSED") throw new Error("You can only review a closed session");
      if (request.userId !== userId) throw new Error("Unauthorized to review");

      // 2. Prevent duplicate (Use 'tx')
      const existingReview = await tx.review.findUnique({
        where: { requestId: requestId }
      });
      if (existingReview) throw new Error("Review already exists");

      // 3. Save the review (Add 'await' and use 'tx')
      const review = await tx.review.create({
        data: {
          rating,
          comment,
          requestId,
          expertId: request.expertId!,
          reviewerId: userId
        }
      });

      // 4. Calculate Average (Use 'tx')
      const allReviews = await tx.review.findMany({
        where: { expertId: request.expertId! },
        select: { rating: true }
      });

      const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = totalRating / allReviews.length;

      // 5. Update Profile (Use 'tx')
      await tx.expertProfile.update({
        where: { userId: request.expertId! },
        data: { rating: avgRating }
      });

      return review;
    });
  }
}