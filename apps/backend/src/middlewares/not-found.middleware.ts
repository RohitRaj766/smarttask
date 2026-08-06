import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../utils/exceptions.js";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundException(`Route ${req.originalUrl} not found`));
};
