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
    price: string,
    features: string[],
    availableRooms: Number,
    isAvailable: Boolean,
    hostelName: string,
    hostelType: HostelTypes,
    cover: string
}

const hostelSchema = new Schema<IHostel>({
    user: {type:SchemaTypes.ObjectId, ref: "Users", required: true},
    images: [{type: String}],
    description: {type: String, required: true},
    location: {type: String, required: true},
    price: {type: String, required: true},
    features: [{type: String}],
    availableRooms: {type: Number, default: 1},
    isAvailable: {type: Boolean, default: true},
    hostelName: {type: String, required: true},
    hostelType: {type: String, enum: Object.values(HostelTypes), default: HostelTypes.SINGLE_ROOMS},
    cover: {type: String},
},
{
    timestamps: true,
})

const Hostels = mongoose.model("Hostels", hostelSchema);

export default Hostels