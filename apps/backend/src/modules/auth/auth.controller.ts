import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { sendSuccessResponse } from "../../utils/response.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/jwt.js";
import { UnauthorizedException } from "../../utils/exceptions.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.signup(req.body);
      sendSuccessResponse(res, 201, result.message, {
        userId: result.userId,
        email: result.email,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.verifyEmail(req.body);
      setAuthCookies(res, accessToken, refreshToken);
      sendSuccessResponse(res, 200, "Email verified successfully", { user, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resendOtp(req.body);
      sendSuccessResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, accessToken, refreshToken } = await this.authService.login(req.body);
      setAuthCookies(res, accessToken, refreshToken);
      sendSuccessResponse(res, 200, "Logged in successfully", { user, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.forgotPassword(req.body);
      sendSuccessResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  };

  verifyResetOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.verifyResetOtp(req.body);
      sendSuccessResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.resetPassword(req.body);
      sendSuccessResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.smarttask_refreshToken;
      const tokens = await this.authService.refreshToken(refreshToken);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      sendSuccessResponse(res, 200, "Token refreshed successfully");
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      clearAuthCookies(res);
      sendSuccessResponse(res, 200, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedException();
      const currentUser = await this.authService.getCurrentUser(req.user.userId);
      sendSuccessResponse(res, 200, "Current user retrieved", { user: currentUser });
    } catch (error) {
      next(error);
    }
  };
}
