import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDatabase } from "./config/database.config.js";
import { initReminderJob } from "./jobs/reminder.job.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  // Initialize Task Reminder Cron Worker
  initReminderJob();

  app.listen(env.PORT, () => {
    console.log(`[Server] Express server running on port ${env.PORT}`);
    console.log(`[Server] Swagger Docs available at http://localhost:${env.PORT}/api-docs`);
  });
};

startServer().catch((error) => {
  console.error("[Server] Fatal error during startup:", error);
  process.exit(1);
});
