import { TaskStatus, TaskPriority, TaskCategory } from "../../shared/types/index.js";

export class EnumService {
  getAllEnums() {
    return {
      statuses: Object.values(TaskStatus),
      priorities: Object.values(TaskPriority),
      categories: Object.values(TaskCategory),
    };
  }

  getTaskStatuses() {
    return Object.values(TaskStatus);
  }

  getTaskPriorities() {
    return Object.values(TaskPriority);
  }

  getTaskCategories() {
    return Object.values(TaskCategory);
  }
}
