import { apiClient } from "./api.client";
import {
  ISuccessResponse,
  ITask,
  ITaskQueryParams,
  IPaginatedData,
  ITaskStats,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "../types";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string | null;
  reminderAt?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  dueDate?: string | null;
  reminderAt?: string | null;
}

export const taskService = {
  async getTasks(params?: ITaskQueryParams): Promise<ISuccessResponse<IPaginatedData<ITask>>> {
    const res = await apiClient.get<ISuccessResponse<IPaginatedData<ITask>>>("/tasks", { params });
    return res.data;
  },

  async getTaskById(taskId: string): Promise<ISuccessResponse<ITask>> {
    const res = await apiClient.get<ISuccessResponse<ITask>>(`/tasks/${taskId}`);
    return res.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<ISuccessResponse<ITask>> {
    const res = await apiClient.post<ISuccessResponse<ITask>>("/tasks", payload);
    return res.data;
  },

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<ISuccessResponse<ITask>> {
    const res = await apiClient.patch<ISuccessResponse<ITask>>(`/tasks/${taskId}`, payload);
    return res.data;
  },

  async deleteTask(taskId: string): Promise<ISuccessResponse<null>> {
    const res = await apiClient.delete<ISuccessResponse<null>>(`/tasks/${taskId}`);
    return res.data;
  },

  async getTaskStats(): Promise<ISuccessResponse<ITaskStats>> {
    const res = await apiClient.get<ISuccessResponse<ITaskStats>>("/tasks/stats");
    return res.data;
  },
};
