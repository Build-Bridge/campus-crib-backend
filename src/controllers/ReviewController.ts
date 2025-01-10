import { Request, Response } from "express";
import { Service } from "typedi";
import ReviewService from "../services/ReviewServices";
import { errorResponse, successResponse } from "../utils/response";

@Service()
class ReviewController {
    private reviewService: ReviewService;

    constructor(reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    async createReview(req: Request, res: Response) {
        try {
            const reviewData = req.body;
            const payload = await this.reviewService.createReview(reviewData);
            successResponse({payload}, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getReviewsByHostel(req: Request, res: Response) {
        try {
            const { hostelId } = req.params;
            const payload = await this.reviewService.getReviewsByHostel(hostelId);
            successResponse({payload}, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getReviewsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const payload = await this.reviewService.getReviewsByUser(userId);
            successResponse({payload}, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async updateReview(req: Request, res: Response) {
        try {
            const { reviewId } = req.params;
            const updateData = req.body;
            const payload = await this.reviewService.updateReview(reviewId, updateData);
            successResponse({payload}, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const { reviewId } = req.params;
            const payload = await this.reviewService.deleteReview(reviewId);
            successResponse({payload}, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default ReviewController;