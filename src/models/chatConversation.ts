import mongoose, { Schema, Types } from "mongoose";

export interface IChatConversation extends Document {
    participants: (Types.ObjectId | string)[]; // Array of user and agent IDs
    lastMessage: string; // Preview of the last message
    lastMessageAt: Date; // Timestamp of the last message
}

const chatConversationSchema = new Schema<IChatConversation>({
    participants: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const ChatConversations = mongoose.model("ChatConversations", chatConversationSchema);

export default ChatConversations;
