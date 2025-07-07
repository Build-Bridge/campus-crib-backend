import mongoose, {Document, Schema, Types} from "mongoose";
import { SubscriptionPlan } from "./subscription";

enum UserType{
    BASIC = "BASIC",
    AGENT = "AGENT"
}

export interface IUser extends Document{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profilePicture: string
    userType: UserType,
    proofOfAddress?: string,
    governmentId?: string,
    schoolId?: string,
    businessRegistration?: string
    bookmarkedHostels?: Types.ObjectId[],
    phoneNumber: string,
    accountNumber: string,
    bankName: string,
    accountName: string,
    resetToken?: string,
    resetTokenExpiration?: Date,
    // Subscription related fields
    currentSubscription?: Types.ObjectId,
    subscriptionPlan?: SubscriptionPlan,
    subscriptionStatus?: 'active' | 'inactive' | 'cancelled' | 'expired',
    subscriptionEndDate?: Date,
    // Agent specific fields
    agentRating?: number,
    agentReviews?: number,
    isVerifiedAgent?: boolean,
    featuredAgent?: boolean,
}

const userSchema = new Schema<IUser>({
    firstName: {type: String, required: true},
    lastName:{type:String, required: true},
    email:{type: String, required:true},
    password: {type:String, required: true},
    profilePicture: {type: String, default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"},
    userType: {type: String,enum: Object.values(UserType), default: UserType.BASIC },
    schoolId: {type: String},
    phoneNumber: {type: String},
    proofOfAddress: {
        type: String
    },
    governmentId : {
        type: String
    },
    businessRegistration: {
        type: String
    },
    bookmarkedHostels: [{ type: Schema.Types.ObjectId, ref: "Hostels" }],
    accountNumber: {type: String},
    bankName: {type: String},   
    accountName: {type: String},
    resetToken: {type: String},
    resetTokenExpiration: {type: Date},
    // Subscription related fields
    currentSubscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
    subscriptionPlan: { type: String, enum: Object.values(SubscriptionPlan) },
    subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'inactive' },
    subscriptionEndDate: { type: Date },
    // Agent specific fields
    agentRating: { type: Number, default: 0 },
    agentReviews: { type: Number, default: 0 },
    isVerifiedAgent: { type: Boolean, default: false },
    featuredAgent: { type: Boolean, default: false },
},
{
    timestamps: true,
})

const Users = mongoose.model("Users", userSchema);

export default Users