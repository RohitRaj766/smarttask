import { IEmailProvider } from "../../providers/email.provider.js";
import { ResendEmailProvider } from "../../providers/resend.provider.js";
import { PromailerEmailProvider } from "../../providers/promailer.provider.js";
import { env } from "../../config/env.config.js";
import { NotificationRepository, notificationRepository } from "./notification.repository.js";
import { CreateNotificationInput } from "./notification.types.js";

const defaultEmailProvider: IEmailProvider = env.API_MAIL_KEY_PROMAILER
  ? new PromailerEmailProvider()
  : new ResendEmailProvider();

export class NotificationService {
  constructor(
    private emailProvider: IEmailProvider = defaultEmailProvider,
    private repository: NotificationRepository = notificationRepository
  ) {}

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    return this.emailProvider.sendEmail({ to, subject, html });
  }

  async createNotification(input: CreateNotificationInput) {
    return this.repository.create(input);
  }

  async getUserNotifications(userId: string) {
    return this.repository.findByUserId(userId);
  }

  async markAsRead(id: string, userId: string) {
    return this.repository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
