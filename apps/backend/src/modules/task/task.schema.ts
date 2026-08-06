import { Schema, model } from "mongoose";
import { ITaskDocument } from "./task.types.js";
import { TaskStatus, TaskPriority, TaskCategory } from "../../shared/types/index.js";

const taskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(TaskCategory),
      default: TaskCategory.WORK,
      index: true,
    },
    dueDate: { type: Date },
    reminderAt: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, isDeleted: 1, title: "text" });

export const TaskModel = model<ITaskDocument>("Task", taskSchema);
