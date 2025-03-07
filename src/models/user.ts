import mongoose, {Document, Schema, Types} from "mongoose";

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
    phoneNumber: string
}

const userSchema = new Schema<IUser>({
    firstName: {type: String, required: true},
    lastName:{type:String, required: true},
    email:{type: String, required:true},
    password: {type:String, required: true},
    profilePicture: {type: String},
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
    bookmarkedHostels: [{ type: Schema.Types.ObjectId, ref: "Hostels" }]
},
{
    timestamps: true,
})

const Users = mongoose.model("Users", userSchema);

export default Users