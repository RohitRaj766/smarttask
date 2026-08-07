import { Router } from "express";
import { ChatController } from "./chat.controller.js";
import { ChatService } from "./chat.service.js";

const router = Router();
const chatService = new ChatService();
const chatController = new ChatController(chatService);

router.post("/", chatController.ask);

export const chatRoutes = router;
