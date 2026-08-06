import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exceptions.js";
import { sendErrorResponse } from "../utils/response.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof HttpException) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  console.error("[Unhandled Error]:", err);
  return sendErrorResponse(res, 500, "Internal Server Error");
};
