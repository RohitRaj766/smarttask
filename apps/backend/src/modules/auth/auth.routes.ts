import { Router } from "express";
import { UserRepository } from "../user/user.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import {
  validateSignup,
  validateLogin,
  validateVerifyEmail,
  validateResendOtp,
  validateForgotPassword,
  validateVerifyResetOtp,
  validateResetPassword,
} from "./auth.validator.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/signup", validateSignup, authController.signup);
router.post("/register", validateSignup, authController.signup);
router.post("/verify-email", validateVerifyEmail, authController.verifyEmail);
router.post("/resend-otp", validateResendOtp, authController.resendOtp);
router.post("/login", validateLogin, authController.login);
router.post("/forgot-password", validateForgotPassword, authController.forgotPassword);
router.post("/verify-reset-otp", validateVerifyResetOtp, authController.verifyResetOtp);
router.post("/reset-password", validateResetPassword, authController.resetPassword);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export const authRoutes = router;
