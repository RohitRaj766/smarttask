import cron from "node-cron";
import { TaskRepository } from "../modules/task/task.repository.js";
import { notificationService } from "../modules/notification/notification.service.js";
import { NotificationType } from "../modules/notification/notification.types.js";
import { getTaskReminderTemplate } from "../templates/task-reminder.js";

const taskRepository = new TaskRepository();
const cronExpression = process.env.CRON_EXPRESSION || "* * * * *";

export function initReminderJob() {
  console.log(`⏰ Initializing Task Reminder Cron Worker with expression: "${cronExpression}"`);

  cron.schedule(cronExpression, async () => {
    try {
      const pendingTasks = await taskRepository.findPendingReminders();
      if (pendingTasks.length === 0) return;

      console.log(`[Cron Reminder Job] Found ${pendingTasks.length} pending reminder task(s).`);

      for (const task of pendingTasks) {
        try {
          const user = task.userId as any;
          if (!user || !user.email) {
            console.warn(`[Cron Reminder Job] Skipping task ${task._id} due to missing user details.`);
            continue;
          }

          const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleString() : "N/A";
          const emailHtml = getTaskReminderTemplate(
            user.name || "User",
            task.title,
            dueDateStr,
            task.priority
          );

          // 1. Dispatch Email via NotificationService -> ResendProvider
          const sentSuccess = await notificationService.sendEmail(
            user.email,
            `Task Reminder: ${task.title}`,
            emailHtml
          );

          if (sentSuccess) {
            // 2. Create In-App Notification Record
            await notificationService.createNotification({
              userId: user._id.toString(),
              taskId: task._id.toString(),
              title: `Task Reminder: ${task.title}`,
              message: `Your task "${task.title}" is due on ${dueDateStr}.`,
              type: NotificationType.REMINDER,
            });

            // 3. Mark Task isReminderSent = true
            await taskRepository.markReminderSent(task._id.toString());

            console.log(
              `[Reminder Sent Successfully] Task: "${task.title}" (${task._id}) -> User: ${user.email}`
            );
          } else {
            console.error(
              `[Reminder Failed] Unable to dispatch email for task "${task.title}" (${task._id}).`
            );
          }
        } catch (taskErr) {
          console.error(`[Cron Reminder Job] Error processing task ${task._id}:`, taskErr);
        }
      }
    } catch (error) {
      console.error("[Cron Reminder Job] Error executing reminder job tick:", error);
    }
  });
}
