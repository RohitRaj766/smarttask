export function getVerifyEmailTemplate(name: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Email - SmartTask</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #172b4d; margin: 0; padding: 20px; }
    .card { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
    .otp-box { background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; font-size: 32px; font-weight: 800; color: #1d4ed8; text-align: center; padding: 16px; margin: 24px 0; letter-spacing: 8px; }
    .footer { font-size: 12px; color: #6b7280; text-align: center; margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">SmartTask</div>
    </div>
    <h2>Verify Your Email Address</h2>
    <p>Hello ${name},</p>
    <p>Thank you for creating an account with SmartTask. Please use the following 6-digit verification code to complete your registration:</p>
    
    <div class="otp-box">${otp}</div>
    
    <p style="font-size: 13px; color: #6b7280;">This code is valid for <strong>10 minutes</strong>. If you did not request this registration, please ignore this email.</p>

    <div class="footer">
      &copy; ${new Date().getFullYear()} SmartTask Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}
