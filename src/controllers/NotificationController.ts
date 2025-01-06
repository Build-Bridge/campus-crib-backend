import { Request, Response } from "express";
import NotificationService from "../services/NotificationService";
import { errorResponse, successResponse } from "../utils/response";


class NotificationController {
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    async createNotification(req: Request, res: Response) {
        try {
            const notificationData = req.body;
            const response = await this.notificationService.createNotification(notificationData);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getNotificationById(req: Request, res: Response) {
        try {
            const { notificationId } = req.params;
            const response = await this.notificationService.getNotificationById(notificationId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async getNotificationsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const response = await this.notificationService.getNotificationsByUser(userId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async updateNotification(req: Request, res: Response) {
        try {
            const { notificationId } = req.params;
            const updateData = req.body;
            const response = await this.notificationService.updateNotification(notificationId, updateData);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }

    async deleteNotification(req: Request, res: Response) {
        try {
            const { notificationId } = req.params;
            const response = await this.notificationService.deleteNotification(notificationId);
            successResponse(response, res);
        } catch (err: any) {
            errorResponse(err.message, res);
        }
    }
}

export default NotificationController;