import { Service } from "typedi";
import ChatRepository from "../repositories/ChatRepository";
import SocketServices from "./SocketServices";

@Service()
class ChatService {
    constructor(private readonly chatRepo: ChatRepository, private readonly socketService: SocketServices) {}

    async sendMessage(sender: string, recipient: string, message: string) {
        // Check if conversation exists
        const participants = [sender, recipient];
        let conversation = await this.chatRepo.findConversation(participants);

        // If not, create a new conversation
        if (!conversation) {
            conversation = await this.chatRepo.createConversation(participants, message);
        } else {
            await this.chatRepo.updateConversation(conversation.id, message);
        }

        // Save the message
        this.socketService.sendSocketMessage(recipient, message, conversation.id);
        const chatMessage = await this.chatRepo.createMessage(sender, recipient, message, conversation.id);
        return {payload: chatMessage, message: "Message sent Successfully"};
    }

    async getConversationMessages(conversationId: string, userId?: string) {
        return{payload: await this.chatRepo.getMessagesByConversation(conversationId, userId), message: "Successful"};
    }

    async getUserConversations(userId: string) {
        return {payload: await this.chatRepo.getUserConversations(userId), message: "Successful"};
    }
}

export default ChatService;
