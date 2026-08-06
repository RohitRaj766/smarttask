import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service.js";
import { sendSuccessResponse } from "../../utils/response.js";
import { UnauthorizedException } from "../../utils/exceptions.js";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const result = await this.taskService.getTasks(req.user.userId, req.query as any);
      sendSuccessResponse(res, 200, "Tasks fetched successfully", result);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const taskId = req.params.taskId as string;
      const task = await this.taskService.getTaskById(taskId, req.user.userId);
      sendSuccessResponse(res, 200, "Task fetched successfully", task);
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const task = await this.taskService.createTask(req.user.userId, req.body);
      sendSuccessResponse(res, 201, "Task created successfully", task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const taskId = req.params.taskId as string;
      const task = await this.taskService.updateTask(
        taskId,
        req.user.userId,
        req.body
      );
      sendSuccessResponse(res, 200, "Task updated successfully", task);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const taskId = req.params.taskId as string;
      await this.taskService.deleteTask(taskId, req.user.userId);
      sendSuccessResponse(res, 200, "Task deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  getTaskStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const stats = await this.taskService.getTaskStats(req.user.userId);
      sendSuccessResponse(res, 200, "Task statistics fetched successfully", stats);
    } catch (error) {
      next(error);
    }
  };
}
