import { TaskRepository } from "./task.repository.js";
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from "./task.dto.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { ITask, TaskStatus } from "../../shared/types/index.js";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  private mapToTask(doc: any): ITask {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      description: doc.description || "",
      status: doc.status,
      priority: doc.priority,
      category: doc.category,
      dueDate: doc.dueDate ? doc.dueDate.toISOString() : undefined,
      reminderAt: doc.reminderAt ? doc.reminderAt.toISOString() : undefined,
      userId: doc.userId.toString(),
      isDeleted: doc.isDeleted || false,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  async createTask(userId: string, dto: CreateTaskDto): Promise<ITask> {
    const taskDoc = await this.taskRepository.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      reminderAt: dto.reminderAt ? new Date(dto.reminderAt) : undefined,
      userId: userId as any,
    });
    return this.mapToTask(taskDoc);
  }

  async getTasks(userId: string, query: TaskQueryDto) {
    const { items, total } = await this.taskRepository.findWithFilters(userId, query);
    const mappedItems = items.map((doc) => this.mapToTask(doc));
    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      items: mappedItems,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
    };
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask> {
    const task = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return this.mapToTask(task);
  }

  async updateTask(taskId: string, userId: string, dto: UpdateTaskDto): Promise<ITask> {
    const updateData: any = { ...dto };
    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }
    if (dto.reminderAt !== undefined) {
      updateData.reminderAt = dto.reminderAt ? new Date(dto.reminderAt) : null;
    }

    const updated = await this.taskRepository.updateByIdAndUser(taskId, userId, updateData);
    if (!updated) {
      throw new NotFoundException("Task not found");
    }
    return this.mapToTask(updated);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const deleted = await this.taskRepository.deleteByIdAndUser(taskId, userId);
    if (!deleted) {
      throw new NotFoundException("Task not found");
    }
  }

  async getTaskStats(userId: string) {
    const counts = await this.taskRepository.getStatusCounts(userId);
    const stats: Record<string, number> = {
      TOTAL: 0,
      [TaskStatus.BACKLOG]: 0,
      [TaskStatus.TODO]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.REVIEW]: 0,
      [TaskStatus.COMPLETED]: 0,
    };

    counts.forEach((item: { _id: string; count: number }) => {
      if (stats[item._id] !== undefined) {
        stats[item._id] = item.count;
        stats.TOTAL += item.count;
      }
    });

    return stats;
  }
}
