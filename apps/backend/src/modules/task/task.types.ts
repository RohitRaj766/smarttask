import { Document, Types } from "mongoose";
import { TaskStatus, TaskPriority, TaskCategory } from "../../shared/types/index.js";

export interface ITaskDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  reminderAt?: Date;
  isReminderSent: boolean;
  reminderSentAt?: Date;
  userId: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
