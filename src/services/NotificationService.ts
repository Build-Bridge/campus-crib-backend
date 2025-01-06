import { Service } from "typedi";
import NotificationRepository from "../repositories/NotificationRepository";
import { INotification } from "../models/notification";
import { Payload } from "../utils/response";
import Users from "../models/user";
import { Types } from "mongoose";
import SocketServices from "./SocketServices";

@Service()
class NotificationService {
    constructor(private notificationRepository: NotificationRepository, private readonly socketServices : SocketServices) {}

    async createNotification(notificationData: Partial<INotification>): Promise<Payload> {
        let notification = await this.notificationRepository.createNotification(notificationData)
        this.socketServices.sendSocketNotification(String(notification.user), notification)
        return {payload: notification};
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

    async sendNotificationToBasicUsers(notificationData: Partial<INotification>): Promise<void> {
        const basicUsers = await Users.find({ userType: "BASIC" }).exec();
        const notifications = basicUsers.map(user => ({
            ...notificationData,
            user: user._id as Types.ObjectId
        }));
        await this.notificationRepository.createMany(notifications);
    }
}

export default NotificationService;