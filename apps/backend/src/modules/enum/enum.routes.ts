import { Router } from "express";
import { EnumService } from "./enum.service.js";
import { EnumController } from "./enum.controller.js";

const router = Router();
const enumService = new EnumService();
const enumController = new EnumController(enumService);

router.get("/", enumController.getAllEnums);
router.get("/task-statuses", enumController.getTaskStatuses);
router.get("/task-priorities", enumController.getTaskPriorities);
router.get("/task-categories", enumController.getTaskCategories);

export const enumRoutes = router;
