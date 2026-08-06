import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { sendSuccessResponse } from "../../utils/response.js";
import { UnauthorizedException } from "../../utils/exceptions.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const profile = await this.userService.getUserById(req.user.userId);
      sendSuccessResponse(res, 200, "User profile fetched successfully", profile);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const updated = await this.userService.updateUser(req.user.userId, req.body);
      sendSuccessResponse(res, 200, "User profile updated successfully", updated);
    } catch (error) {
      next(error);
    }
  };
}
