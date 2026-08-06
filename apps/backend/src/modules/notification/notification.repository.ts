import { NotificationModel, INotificationDocument } from "./notification.schema.js";
import { CreateNotificationInput } from "./notification.types.js";

export class NotificationRepository {
  async create(input: CreateNotificationInput): Promise<INotificationDocument> {
    return NotificationModel.create(input);
  }

  async findByUserId(userId: string): Promise<INotificationDocument[]> {
    return NotificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(id: string, userId: string): Promise<INotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    ).exec();
    return result.modifiedCount;
  }
}

export const notificationRepository = new NotificationRepository();
