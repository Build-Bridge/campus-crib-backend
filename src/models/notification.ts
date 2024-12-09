import mongoose, {Document, Schema, SchemaType, SchemaTypes, Types} from "mongoose";

export interface INotification extends Document{
    user: Types.ObjectId,
    message:String, 
    title:String,
    actionLink: String
}

const NotificationsSchema = new Schema<INotification>({
    user: {type:  SchemaTypes.ObjectId, ref: "Users"},
    message:String, 
    title:String,
    actionLink: String
},
{
    timestamps: true,
})

const Notifications = mongoose.model("Notificationss", NotificationsSchema);

export default Notifications