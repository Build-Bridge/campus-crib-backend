import { Service } from "typedi";
import ReviewRepository from "../repositories/ReviewRepository";
import { IReview } from "../models/review";

@Service()
class ReviewService {
    constructor(private readonly reviewRepository: ReviewRepository) {}

    async createReview(reviewData: Partial<IReview>): Promise<IReview> {
        return await this.reviewRepository.createReview(reviewData);
    }

    async getReviewsByHostel(hostelId: string): Promise<IReview[]> {
        return await this.reviewRepository.findReviewsByHostel(hostelId);
    }

    async getReviewsByUser(userId: string): Promise<IReview[]> {
        return await this.reviewRepository.findReviewsByUser(userId);
    }

    async updateReview(reviewId: string, updateData: Partial<IReview>): Promise<IReview | null> {
        return await this.reviewRepository.updateReview(reviewId, updateData);
    }

    async deleteReview(reviewId: string): Promise<IReview | null> {
        return await this.reviewRepository.deleteReview(reviewId);
    }
}

export default ReviewService;