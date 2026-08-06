import { Router } from "express";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validateUpdateUser } from "./user.validator.js";

const router = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/profile", authenticate, userController.getProfile);
router.patch("/profile", authenticate, validateUpdateUser, userController.updateProfile);

export const userRoutes = router;
