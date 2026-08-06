import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env } from "./config/env.config.js";
import { setupSwagger } from "./config/swagger.config.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { taskRoutes } from "./modules/task/task.routes.js";
import { enumRoutes } from "./modules/enum/enum.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app: Express = express();

// 1. Helmet
app.use(helmet());

// 2. Cors
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// 3. Morgan (Logging every request)
app.use(morgan("dev"));

// 4. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);

// 5. Cookie Parser
app.use(cookieParser());

// 6. JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation
setupSwagger(app);

// 7. Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/enum", enumRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// 8. 404 Middleware
app.use(notFoundHandler);

// 9. Global Error Handler
app.use(errorHandler);

export default app;
