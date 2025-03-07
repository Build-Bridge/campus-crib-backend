import { Service } from "typedi";
import ChatConversations from "../models/chatConversation";
import ChatMessages from "../models/chatMessages";
import { Types } from "mongoose";

@Service()
class ChatRepository {
  async createConversation(
    participants: string[],
    lastMessage: string,
    user: string | Types.ObjectId
  ) {
    return await ChatConversations.create({
      participants,
      lastMessage,
      lastMessageAt: new Date(),
      user,
    });
  }

  async findConversation(participants: string[]) {
    return await ChatConversations.findOne({
      participants: { $all: participants },
    });
  }

  async updateConversation(conversationId: string, lastMessage: string) {
    return await ChatConversations.findByIdAndUpdate(
      conversationId,
      { lastMessage, lastMessageAt: new Date() },
      { new: true }
    );
  }

  async createMessage(
    sender: string,
    recipient: string,
    message: string,
    conversationId: string
  ) {
    return await ChatMessages.create({
      sender,
      recipient,
      message,
      conversationId,
    });
  }

  async getMessagesByConversation(conversationId: string, userId?: string) {
    if (userId) {
      const conversation = await ChatConversations.findOne({
        participants: { $all: [userId, conversationId] },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      conversationId = conversation._id.toString();
    }

    return await ChatMessages.find({ conversationId }).sort({ timestamp: 1 });
  }

  async getUserConversations(userId: string) {
    return await ChatConversations.find({ user: userId }).sort({
      lastMessageAt: -1,
    });
  }
}

export default ChatRepository;
