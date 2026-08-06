import { z } from "zod";
import { TaskStatus, TaskPriority, TaskCategory } from "../../shared/types/index.js";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  category: z.nativeEnum(TaskCategory).default(TaskCategory.WORK),
  dueDate: z.string().datetime({ offset: true }).or(z.string().date()).optional().nullable(),
  reminderAt: z.string().datetime({ offset: true }).or(z.string().date()).optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["dueDate", "createdAt", "priority", "status", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type TaskQueryDto = z.infer<typeof taskQuerySchema>;
