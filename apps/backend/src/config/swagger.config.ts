import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SmartTask Management API",
    version: "1.0.0",
    description: "Production-Ready RESTful API for Task Management Monorepo Application",
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
        name: "accessToken",
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
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
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
          userId: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
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
        responses: { 201: { description: "User registered successfully" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
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
        responses: { 200: { description: "Logged in successfully" } },
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
    "/enum": {
      get: {
        tags: ["Enums"],
        summary: "Get all enum types",
        responses: { 200: { description: "All enums" } },
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
