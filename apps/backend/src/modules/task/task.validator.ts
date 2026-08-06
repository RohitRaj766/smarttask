import { validateRequest, validateQuery } from "../../middlewares/validation.middleware.js";
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from "./task.dto.js";

export const validateCreateTask = validateRequest(createTaskSchema);
export const validateUpdateTask = validateRequest(updateTaskSchema);
export const validateTaskQuery = validateQuery(taskQuerySchema);
