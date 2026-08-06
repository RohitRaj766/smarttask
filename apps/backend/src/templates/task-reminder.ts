import { env } from "../config/env.config.js";

export function getTaskReminderTemplate(
  name: string,
  taskTitle: string,
  dueDate: string,
  priority: string
): string {
  const loginUrl = `${env.CORS_ORIGIN}/login`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Task Reminder - SmartTask</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #172b4d; margin: 0; padding: 20px; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
    .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { margin-bottom: 12px; font-size: 14px; }
    .detail-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #6b7280; letter-spacing: 0.5px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 700; border-radius: 9999px; background: #eff6ff; color: #1d4ed8; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; transition: background-color 0.2s; }
    .footer { font-size: 12px; color: #6b7280; text-align: center; margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">SmartTask</div>
    </div>
    <h2>Task Reminder Alert</h2>
    <p>Hello ${name},</p>
    <p>This is an automated reminder for your upcoming task on SmartTask.</p>
    
    <div class="detail-box">
      <div class="detail-row">
        <div class="detail-label">Task Title</div>
        <div style="font-size: 18px; font-weight: 700; color: #111827; margin-top: 4px;">${taskTitle}</div>
      </div>
      <div class="detail-row" style="margin-top: 16px;">
        <div class="detail-label">Target Due Date</div>
        <div style="font-weight: 600; color: #374151; margin-top: 4px;">${dueDate}</div>
      </div>
      <div class="detail-row" style="margin-top: 16px;">
        <div class="detail-label">Priority Level</div>
        <div style="margin-top: 4px;"><span class="badge">${priority}</span></div>
      </div>
    </div>
    
    <p>Log in to your SmartTask dashboard to manage or complete this task:</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${loginUrl}" class="btn" target="_blank">
        Log In to SmartTask &rarr;
      </a>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} SmartTask Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}
