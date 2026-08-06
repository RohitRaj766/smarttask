import { validateRequest } from "../../middlewares/validation.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./user.dto.js";

export const validateUpdateUser = validateRequest(updateUserSchema);
export const validateChangePassword = validateRequest(changePasswordSchema);
