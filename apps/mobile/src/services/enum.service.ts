import { apiClient } from "./api.client";
import { ISuccessResponse, TaskStatus, TaskPriority, TaskCategory } from "../types";

export interface EnumsData {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  categories: TaskCategory[];
}

export const enumService = {
  async getAllEnums(): Promise<ISuccessResponse<EnumsData>> {
    const res = await apiClient.get<ISuccessResponse<EnumsData>>("/enums");
    return res.data;
  },
};
