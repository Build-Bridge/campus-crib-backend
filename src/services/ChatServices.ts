import { Service } from "typedi";
import ChatRepository from "../repositories/ChatRepository";
import SocketServices from "./SocketServices";
import Users from "../models/user";

@Service()
class ChatService {
    constructor(private readonly chatRepo: ChatRepository, private readonly socketService: SocketServices) {}

   

    async sendMessage(sender: string, recipient: string, message: string) {
        // Check if conversation exists
        const participants = [sender, recipient];
        let conversation = await this.chatRepo.findConversation(participants);

        // If not, create a new conversation
        if (!conversation) {
            conversation = await this.chatRepo.createConversation(participants, message, sender);
        } else {
            await this.chatRepo.updateConversation(conversation.id, message);
        }

        // Save the message
        this.socketService.sendSocketMessage(recipient, message, conversation.id);
        const chatMessage = await this.chatRepo.createMessage(sender, recipient, message, conversation.id);
        return {payload: chatMessage, message: "Message sent Successfully"};
    }

    async getConversationMessages(conversationId: string, userId?: string) {
        let messages = await this.chatRepo.getMessagesByConversation(conversationId, userId);
        let conversation = await this.chatRepo.findConversationById(conversationId);

        let otherUser;

        let participants = conversation?.participants

        if (participants) {
            for (const participant of participants) {
                if (participant !== userId) {
                    otherUser = await Users.findById(participant);
                    break;
                }
            }
        }
        return { payload: { messages, otherUser }, message: "Successful" };
    }

    async getUserConversations(userId: string) {
        let conversations = await this.chatRepo.getUserConversations(userId);
    const populatedConversations = [];

    for (const conversation of conversations) {
        let otherUser;
        for (const participant of conversation.participants) {
        if (participant !== userId) {
            otherUser = await Users.findById(participant);
            break;
        }
        }
        populatedConversations.push({ ...conversation, otherUser });
    }

    return { payload: populatedConversations, message: "Successful" };
    }
}

export default ChatService;
