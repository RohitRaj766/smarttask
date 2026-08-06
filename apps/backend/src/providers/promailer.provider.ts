import { IEmailProvider, SendEmailOptions } from "./email.provider.js";
import { env } from "../config/env.config.js";

export class PromailerEmailProvider implements IEmailProvider {
  private apiKey: string | undefined;
  private defaultFrom: string;
  private endpoint: string;

  constructor() {
    this.apiKey = env.API_MAIL_KEY_PROMAILER;
    this.defaultFrom = env.EMAIL_FROM_PROMAILER;
    this.endpoint = env.PROMAILER_URL;

    if (!this.apiKey) {
      console.warn(
        "⚠️ API_MAIL_KEY_PROMAILER is missing. Email dispatches will be logged to console in mock mode."
      );
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const from = options.from || this.defaultFrom;

      if (!this.apiKey) {
        console.log("----------------------------------------------------");
        console.log(`[MOCK EMAIL SENT via PromailerProvider]`);
        console.log(`To: ${options.to}`);
        console.log(`From: ${from}`);
        console.log(`Subject: ${options.subject}`);
        console.log("----------------------------------------------------");
        return true;
      }

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          html: options.html,
          from,
        }),
        signal: AbortSignal.timeout(60000), // 60s timeout as per API specs
      });

      const data: any = await response.json();

      if (!response.ok || !data.success) {
        console.error("Promailer Provider Error:", data);
        return false;
      }

      console.log(
        `[Email Sent successfully via Promailer] Message ID: ${data?.data?.messageId || "N/A"}`
      );
      return true;
    } catch (error) {
      console.error("Failed to send email via PromailerProvider:", error);
      return false;
    }
  }
}
