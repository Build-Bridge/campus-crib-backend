import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPayment extends Document {
    user: Types.ObjectId | string;
    inspectionRequest: Types.ObjectId | string;
    amount: number;
    status: 'pending'| 'completed'| 'failed'
}

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    inspectionRequest: { type: Schema.Types.ObjectId, ref: "InspectionRequest", required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
}, {
    timestamps: true,
});

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;