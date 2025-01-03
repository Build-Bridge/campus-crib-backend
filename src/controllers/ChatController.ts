import { Service } from "typedi";
import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import ChatService from "../services/ChatServices";

@Service()
class ChatController {
    constructor(private readonly chatService: ChatService) {}

    async sendMessage(req: Request, res: Response) {
        try {
            const { recipient, message } = req.body;
            const sender = req.body.user; // From verifyAuth middleware
            const response = await this.chatService.sendMessage(sender, recipient, message);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getConversationMessages(req: Request, res: Response) {
        try {
            const { conversationId } = req.params;
            const response = await this.chatService.getConversationMessages(conversationId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getUserConversations(req: Request, res: Response) {
        try {
            const userId = req.body.user; // From verifyAuth middleware
            const response = await this.chatService.getUserConversations(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default ChatController;
