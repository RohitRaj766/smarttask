import { apiClient } from "./api.client";
import {
  ISuccessResponse,
  ITask,
  ITaskQueryParams,
  IPaginatedData,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from "@/types";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string | null;
  reminderAt?: string | null;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface ITaskStats {
  TOTAL: number;
  [TaskStatus.BACKLOG]: number;
  [TaskStatus.TODO]: number;
  [TaskStatus.IN_PROGRESS]: number;
  [TaskStatus.REVIEW]: number;
  [TaskStatus.COMPLETED]: number;
}

export const taskApi = {
  getTasks: async (params?: ITaskQueryParams): Promise<ISuccessResponse<IPaginatedData<ITask>>> => {
    const response = await apiClient.get("/tasks", { params });
    return response.data;
  },

  getTaskById: async (taskId: string): Promise<ISuccessResponse<ITask>> => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (payload: CreateTaskPayload): Promise<ISuccessResponse<ITask>> => {
    const response = await apiClient.post("/tasks", payload);
    return response.data;
  },

  updateTask: async (
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<ISuccessResponse<ITask>> => {
    const response = await apiClient.patch(`/tasks/${taskId}`, payload);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<ISuccessResponse<object>> => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },

  getTaskStats: async (): Promise<ISuccessResponse<ITaskStats>> => {
    const response = await apiClient.get("/tasks/stats");
    return response.data;
  },
};
