import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, IJwtPayload } from "../utils/jwt.js";
import { UnauthorizedException } from "../utils/exceptions.js";

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException("Authentication token missing");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedException("Invalid or expired authentication token"));
  }
};
