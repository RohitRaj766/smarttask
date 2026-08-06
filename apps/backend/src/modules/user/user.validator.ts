import { validateRequest } from "../../middlewares/validation.middleware.js";
import { updateUserSchema } from "./user.dto.js";

export const validateUpdateUser = validateRequest(updateUserSchema);
