import { Router } from "express";
import { TaskRepository } from "./task.repository.js";
import { TaskService } from "./task.service.js";
import { TaskController } from "./task.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
} from "./task.validator.js";

const router = Router();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.use(authenticate);

router.get("/", validateTaskQuery, taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.get("/:taskId", taskController.getTaskById);
router.post("/", validateCreateTask, taskController.createTask);
router.patch("/:taskId", validateUpdateTask, taskController.updateTask);
router.delete("/:taskId", taskController.deleteTask);

export const taskRoutes = router;
