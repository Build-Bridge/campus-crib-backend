import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChatMessage extends Document {
    sender: Types.ObjectId | string;  // User or Agent ID
    recipient: Types.ObjectId | string; // User or Agent ID
    message: string;
    timestamp: Date;
    conversationId: Types.ObjectId | string; // Link to a conversation
}

const chatMessageSchema = new Schema<IChatMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    conversationId: { type: Schema.Types.ObjectId, ref: "ChatConversation", required: true },
});

const ChatMessages = mongoose.model("ChatMessages", chatMessageSchema);

export default ChatMessages;
