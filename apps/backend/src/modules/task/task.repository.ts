import { FilterQuery } from "mongoose";
import { BaseRepository } from "../../shared/base.repository.js";
import { TaskModel } from "./task.schema.js";
import { ITaskDocument } from "./task.types.js";
import { TaskQueryDto } from "./task.dto.js";

export class TaskRepository extends BaseRepository<ITaskDocument> {
  constructor() {
    super(TaskModel);
  }

  async findWithFilters(userId: string, query: TaskQueryDto) {
    const { search, status, priority, category, page, limit, sortBy, order } = query;
    const filter: FilterQuery<ITaskDocument> = { userId, isDeleted: false };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return { items, total };
  }

  async findByIdAndUser(taskId: string, userId: string): Promise<ITaskDocument | null> {
    return this.model.findOne({ _id: taskId, userId, isDeleted: false }).exec();
  }

  async updateByIdAndUser(
    taskId: string,
    userId: string,
    updateData: Partial<ITaskDocument>
  ): Promise<ITaskDocument | null> {
    return this.model
      .findOneAndUpdate({ _id: taskId, userId, isDeleted: false }, updateData, { new: true })
      .exec();
  }

  async deleteByIdAndUser(taskId: string, userId: string): Promise<ITaskDocument | null> {
    return this.model
      .findOneAndUpdate({ _id: taskId, userId, isDeleted: false }, { isDeleted: true }, { new: true })
      .exec();
  }

  async getStatusCounts(userId: string) {
    return this.model.aggregate([
      { $match: { userId, isDeleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }
}
