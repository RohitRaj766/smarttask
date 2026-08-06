export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskCategory {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  STUDY = "STUDY",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  reminderAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITaskQueryParams {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: TaskCategory;
  page?: number;
  limit?: number;
  sortBy?: "dueDate" | "createdAt" | "priority" | "status" | "title";
  order?: "asc" | "desc";
}

export interface ISuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface IErrorResponse {
  success: false;
  message: string;
}

export type IApiResponse<T = unknown> = ISuccessResponse<T> | IErrorResponse;

export interface IPaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
