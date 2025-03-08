import { Service } from "typedi";
import Review, { IReview } from "../models/review";
import { BaseRepository } from "./BaseRepository";

@Service()
class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(Review);
    }

    async createReview(reviewData: Partial<IReview>): Promise<IReview> {
        const review = new Review(reviewData);
        return await review.save();
    }

    async findReviewsByHostel(hostelId: string): Promise<IReview[]> {
        return await Review.find({ hostel: hostelId }).populate("user").exec();
    }

    async findReviewsByUser(userId: string): Promise<IReview[]> {
        return await Review.find({ user: userId }).populate("user").exec();
    }

    async updateReview(reviewId: string, updateData: Partial<IReview>): Promise<IReview | null> {
        return await Review.findByIdAndUpdate(reviewId, updateData, { new: true }).exec();
    }

    async deleteReview(reviewId: string): Promise<IReview | null> {
        return await Review.findByIdAndDelete(reviewId).exec();
    }
}

export default ReviewRepository;