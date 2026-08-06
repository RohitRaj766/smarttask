import { Response } from "express";
import { ISuccessResponse, IErrorResponse } from "../shared/types/index.js";

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response => {
  const responsePayload: ISuccessResponse<T | object> = {
    success: true,
    message,
    data: data ?? {},
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
): Response => {
  const responsePayload: IErrorResponse = {
    success: false,
    message,
  };
  return res.status(statusCode).json(responsePayload);
};
