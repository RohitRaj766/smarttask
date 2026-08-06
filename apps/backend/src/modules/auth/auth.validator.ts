import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from "./auth.dto.js";

export const validateSignup = validateRequest(signupSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateVerifyEmail = validateRequest(verifyEmailSchema);
export const validateResendOtp = validateRequest(resendOtpSchema);
export const validateForgotPassword = validateRequest(forgotPasswordSchema);
export const validateVerifyResetOtp = validateRequest(verifyResetOtpSchema);
export const validateResetPassword = validateRequest(resetPasswordSchema);
