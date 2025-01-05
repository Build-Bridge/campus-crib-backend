import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInspectionRequest extends Document {
    user: Types.ObjectId | string;
    hostel: Types.ObjectId | string;
    inspectionDate: Date;
    status: 'pending' | 'approved' | 'rejected'
}

const inspectionRequestSchema = new Schema<IInspectionRequest>({
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    hostel: { type: Schema.Types.ObjectId, ref: "Hostels", required: true },
    inspectionDate: { type: Date, required: true },
    status: { type: String, default: 'pending' },
}, {
    timestamps: true,
});

const InspectionRequest = mongoose.model<IInspectionRequest>("InspectionRequest", inspectionRequestSchema);

export default InspectionRequest;