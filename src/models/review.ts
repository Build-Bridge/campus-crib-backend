import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview extends Document {
    user: Types.ObjectId | string;
    hostel: Types.ObjectId | string;
    rating: number;
    comment: string;
}

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    hostel: { type: Schema.Types.ObjectId, ref: "Hostels", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;