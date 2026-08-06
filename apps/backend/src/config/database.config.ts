import mongoose from "mongoose";
import { env } from "./env.config.js";
import { UserModel } from "../modules/user/user.schema.js";
import { TaskModel } from "../modules/task/task.schema.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    // Ensure collections and indexes exist in MongoDB on startup
    await Promise.all([
      UserModel.createCollection(),
      TaskModel.createCollection(),
    ]);
    console.log("[Database] Collections and indexes synchronized successfully.");
  } catch (error) {
    console.error("[Database] Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
