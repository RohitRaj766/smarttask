import { Request, Response, NextFunction } from "express";
import { EnumService } from "./enum.service.js";
import { sendSuccessResponse } from "../../utils/response.js";

export class EnumController {
  constructor(private readonly enumService: EnumService) {}

  getAllEnums = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.enumService.getAllEnums();
      sendSuccessResponse(res, 200, "Enums fetched successfully", data);
    } catch (error) {
      next(error);
    }
  };

  getTaskStatuses = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.enumService.getTaskStatuses();
      sendSuccessResponse(res, 200, "Task statuses fetched successfully", data);
    } catch (error) {
      next(error);
    }
  };

  getTaskPriorities = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.enumService.getTaskPriorities();
      sendSuccessResponse(res, 200, "Task priorities fetched successfully", data);
    } catch (error) {
      next(error);
    }
  };

  getTaskCategories = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.enumService.getTaskCategories();
      sendSuccessResponse(res, 200, "Task categories fetched successfully", data);
    } catch (error) {
      next(error);
    }
  };
}
