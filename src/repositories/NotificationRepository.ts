import { Service } from "typedi";
import Notifications, { INotification } from "../models/notification";
import { BaseRepository } from "./BaseRepository";

@Service()
class NotificationRepository extends BaseRepository<INotification> {
    constructor() {
        super(Notifications);
    }

    async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
        const notification = new Notifications(notificationData);
        return await notification.save();
    }

    async findNotificationById(notificationId: string): Promise<INotification | null> {
        return await Notifications.findById(notificationId).exec();
    }

    async findNotificationsByUser(userId: string): Promise<INotification[]> {
        return await Notifications.find({ user: userId }).sort({ createdAt: -1 }).exec();
    }

    async updateNotification(notificationId: string, updateData: Partial<INotification>): Promise<INotification | null> {
        return await Notifications.findByIdAndUpdate(notificationId, updateData, { new: true }).exec();
    }

    async deleteNotification(notificationId: string): Promise<INotification | null> {
        return await Notifications.findByIdAndDelete(notificationId).exec();
    }

    async createMany(notifications: Partial<INotification>[]): Promise<INotification[]> {
        const createdNotifications = await Notifications.insertMany(notifications);
        return createdNotifications as INotification[];
    }
}

export default NotificationRepository;