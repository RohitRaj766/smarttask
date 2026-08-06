import { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service.js";
import { sendSuccessResponse } from "../../utils/response.js";
import { NotFoundException, UnauthorizedException } from "../../utils/exceptions.js";

export class NotificationController {
  getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const userId = req.user.userId;
      const notifications = await notificationService.getUserNotifications(userId);
      sendSuccessResponse(res, 200, "Notifications fetched successfully", notifications);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const userId = req.user.userId;
      const { id } = req.params;
      const notification = await notificationService.markAsRead(id, userId);

      if (!notification) {
        throw new NotFoundException("Notification not found");
      }

      sendSuccessResponse(res, 200, "Notification marked as read", notification);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const userId = req.user.userId;
      const count = await notificationService.markAllAsRead(userId);
      sendSuccessResponse(res, 200, `${count} notifications marked as read`, { modifiedCount: count });
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
