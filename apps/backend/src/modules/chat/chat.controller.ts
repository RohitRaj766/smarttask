import { Request, Response, NextFunction } from "express";
import { ChatService } from "./chat.service.js";
import { sendSuccessResponse } from "../../utils/response.js";

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  ask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { messages } = req.body;
      const reply = await this.chatService.askGrok(messages);
      sendSuccessResponse(res, 200, "Response generated successfully", { reply });
    } catch (error) {
      next(error);
    }
  };
}
