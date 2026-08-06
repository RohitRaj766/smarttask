import { apiClient } from "./api.client";
import { ISuccessResponse, TaskStatus, TaskPriority, TaskCategory } from "@/types";

export interface IEnumsResponse {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  categories: TaskCategory[];
}

export const enumApi = {
  getAllEnums: async (): Promise<ISuccessResponse<IEnumsResponse>> => {
    const response = await apiClient.get("/enum");
    return response.data;
  },

  getTaskStatuses: async (): Promise<ISuccessResponse<TaskStatus[]>> => {
    const response = await apiClient.get("/enum/task-statuses");
    return response.data;
  },

  getTaskPriorities: async (): Promise<ISuccessResponse<TaskPriority[]>> => {
    const response = await apiClient.get("/enum/task-priorities");
    return response.data;
  },

  getTaskCategories: async (): Promise<ISuccessResponse<TaskCategory[]>> => {
    const response = await apiClient.get("/enum/task-categories");
    return response.data;
  },
};
