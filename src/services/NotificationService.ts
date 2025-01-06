import { Service } from "typedi";
import NotificationRepository from "../repositories/NotificationRepository";
import { INotification } from "../models/notification";
import { Payload } from "../utils/response";

@Service()
class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    async createNotification(notificationData: Partial<INotification>): Promise<Payload> {
        return {payload: await this.notificationRepository.createNotification(notificationData)};
    }

    async getNotificationById(notificationId: string): Promise<Payload> {
        return {payload: await this.notificationRepository.findNotificationById(notificationId)};
    }

    async getNotificationsByUser(userId: string): Promise<Payload> {
        return {payload: await this.notificationRepository.findNotificationsByUser(userId)};
    }

    async updateNotification(notificationId: string, updateData: Partial<INotification>): Promise<Payload> {
        return {payload: await this.notificationRepository.updateNotification(notificationId, updateData)};
    }

    async deleteNotification(notificationId: string): Promise<Payload> {
        return {payload: await this.notificationRepository.deleteNotification(notificationId)};
    }
}

export default NotificationService;