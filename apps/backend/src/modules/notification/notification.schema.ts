import { Schema, model, Document } from "mongoose";
import { INotification, NotificationType } from "./notification.types.js";

export interface INotificationDocument extends Omit<INotification, "_id">, Document {}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task", default: null },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
    },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model<INotificationDocument>(
  "Notification",
  NotificationSchema
);
