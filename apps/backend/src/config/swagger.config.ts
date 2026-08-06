import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SmartTask Management API",
    version: "1.0.0",
    description:
      "Production-Ready RESTful API for Task Management Monorepo Application with OTP Verification, Forgot Password, Resend Email Provider, and Task Reminder System",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "smarttask_accessToken",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          isEmailVerified: { type: "boolean" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          taskId: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
          type: { type: "string", enum: ["EMAIL", "SYSTEM", "REMINDER"] },
          isRead: { type: "boolean" },
          createdAt: { type: "string" },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"] },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          category: { type: "string", enum: ["WORK", "PERSONAL", "STUDY", "SHOPPING", "HEALTH", "OTHER"] },
          dueDate: { type: "string" },
          reminderAt: { type: "string" },
          isReminderSent: { type: "boolean" },
          userId: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
      TaskStats: {
        type: "object",
        properties: {
          TOTAL: { type: "integer", example: 49 },
          BACKLOG: { type: "integer", example: 0 },
          TODO: { type: "integer", example: 49 },
          IN_PROGRESS: { type: "integer", example: 0 },
          REVIEW: { type: "integer", example: 0 },
          COMPLETED: { type: "integer", example: 0 },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register new user (dispatches 6-digit OTP email)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "User registered, OTP sent" } },
      },
    },
    "/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email using 6-digit OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Email verified & tokens issued" } },
      },
    },
    "/auth/resend-otp": {
      post: {
        tags: ["Auth"],
        summary: "Resend email verification 6-digit OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "New OTP dispatched" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login (Requires verified email)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Logged in successfully" }, 403: { description: "Email not verified" } },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset OTP email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Reset OTP sent if email exists" } },
      },
    },
    "/auth/verify-reset-otp": {
      post: {
        tags: ["Auth"],
        summary: "Verify password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OTP verified" } },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Password reset successful" } },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "User logout",
        responses: { 200: { description: "Logged out successfully" } },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: { 200: { description: "Token refreshed" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "User profile" } },
      },
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get user notifications list",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Notifications list" } },
      },
    },
    "/notifications/read-all": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "All notifications marked read" } },
      },
    },
    "/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark single notification as read",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Notification marked read" } },
      },
    },
    "/enum": {
      get: {
        tags: ["Enums"],
        summary: "Get all enum types",
        responses: { 200: { description: "All enums" } },
      },
    },
    "/tasks/stats": {
      get: {
        tags: ["Tasks"],
        summary: "Get task count statistics by status",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Task count statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task statistics fetched successfully" },
                    data: { $ref: "#/components/schemas/TaskStats" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Get list of tasks with search/filter/pagination",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "priority", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "sortBy", in: "query", schema: { type: "string" } },
          { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
        ],
        responses: { 200: { description: "List of tasks" } },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create new task",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "status", "priority", "category"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  priority: { type: "string" },
                  category: { type: "string" },
                  dueDate: { type: "string" },
                  reminderAt: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Task created" } },
      },
    },
    "/tasks/{taskId}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task details",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Task details" } },
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update task",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Task updated" } },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Task deleted" } },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
