import { Resend } from "resend";
import { IEmailProvider, SendEmailOptions } from "./email.provider.js";
import { env } from "../config/env.config.js";

export class ResendEmailProvider implements IEmailProvider {
  private resend: Resend | null = null;
  private defaultFrom: string;

  constructor() {
    const apiKey = env.RESEND_API_KEY;
    this.defaultFrom = env.EMAIL_FROM;

    if (apiKey && apiKey !== "re_123456789_mock_or_dev_key") {
      this.resend = new Resend(apiKey);
    } else {
      console.warn(
        "⚠️ Resend API Key is missing or default. Email dispatches will be logged to console in dev mode."
      );
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const from = options.from || this.defaultFrom;

      if (!this.resend) {
        console.log("----------------------------------------------------");
        console.log(`[MOCK EMAIL SENT via ResendProvider]`);
        console.log(`To: ${options.to}`);
        console.log(`From: ${from}`);
        console.log(`Subject: ${options.subject}`);
        console.log("----------------------------------------------------");
        return true;
      }

      const response = await this.resend.emails.send({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (response.error) {
        console.error("Resend Email Provider Error:", response.error);
        return false;
      }

      console.log(`[Email Sent successfully via Resend] ID: ${response.data?.id}`);
      return true;
    } catch (error) {
      console.error("Failed to send email via ResendProvider:", error);
      return false;
    }
  }
}
