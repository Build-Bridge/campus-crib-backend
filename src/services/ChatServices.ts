import { Service } from "typedi";
import ChatRepository from "../repositories/ChatRepository";

@Service()
class ChatService {
    constructor(private readonly chatRepo: ChatRepository) {}

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
        const chatMessage = await this.chatRepo.createMessage(sender, recipient, message, conversation.id);
        return {payload: chatMessage, message: "Message sent Successfully"};
    }

    async getConversationMessages(conversationId: string) {
        return{payload: await this.chatRepo.getMessagesByConversation(conversationId), message: "Successful"};
    }

    async getUserConversations(userId: string) {
        return {payload: await this.chatRepo.getUserConversations(userId), message: "Successful"};
    }
}

export default ChatService;
