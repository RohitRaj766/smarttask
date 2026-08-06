import { Types } from "mongoose";

export enum NotificationType {
  EMAIL = "EMAIL",
  SYSTEM = "SYSTEM",
  REMINDER = "REMINDER",
}

export interface INotification {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  taskId?: Types.ObjectId | string | null;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  taskId?: string;
  title: string;
  message: string;
  type: NotificationType;
}
