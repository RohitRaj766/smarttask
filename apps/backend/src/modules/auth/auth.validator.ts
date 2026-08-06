import { validateRequest } from "../../middlewares/validation.middleware.js";
import { signupSchema, loginSchema } from "./auth.dto.js";

export const validateSignup = validateRequest(signupSchema);
export const validateLogin = validateRequest(loginSchema);
