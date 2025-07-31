import mongoose, {Document, Schema, SchemaTypes, Types} from "mongoose";

export enum HostelTypes{
    SINGLE_ROOMS = "SINGLE_ROOMS",
    SHARED_ROOMS = "SHARED_ROOMS",
    APARTMENTS = "APARTMENTS",
    SUITES = "SUITES"
}
export interface IHostel extends Document{
    user: Types.ObjectId | string,
    images:string[],
    description:  string,
    location: string,
    price: number,
    features: string[],
    availableRooms: Number,
    isAvailable: Boolean,
    hostelName: string,
    hostelType: string,
    cover: string,
    // Subscription-based features
    isPriorityListing?: boolean,
    isFeatured?: boolean,
    views?: number,
    inquiries?: number,
    promoCode?: string,
    discountPercentage?: number,
    createdAt: Date,
    updatedAt: Date
}

const hostelSchema = new Schema<IHostel>({
    user: {type:SchemaTypes.ObjectId, ref: "Users", required: true},
    images: [{type: String}],
    description: {type: String, required: true},
    location: {type: String, required: true},
    price: {type: Number, required: true},
    features: [{type: String}],
    availableRooms: {type: Number, default: 1},
    isAvailable: {type: Boolean, default: true},
    hostelName: {type: String, required: true},
    hostelType: {type: String, default: "Single Room"},
    cover: {type: String},
    // Subscription-based features
    isPriorityListing: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    promoCode: { type: String },
    discountPercentage: { type: Number, min: 0, max: 100 },
},
{
    timestamps: true,
})

const Hostels = mongoose.model("Hostels", hostelSchema);

export default Hostels