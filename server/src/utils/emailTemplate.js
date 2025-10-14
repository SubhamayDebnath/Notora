//  verification Email Template
export const verificationEmailTemplate = (username, verificationLink) => `
<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Verify Your Email</title>
  <style>
    body {
      background-color: #f9fafb;
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: 40px auto;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 30px 25px;
      text-align: center;
    }
    .body h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .body p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background 0.3s ease;
    }
    .btn:hover {
      background-color: #1e40af;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email Address</h1>
    </div>
    <div class="body">
      <h2>Hello, ${username} 👋</h2>
      <p>Thank you for signing up! Please confirm your email address to activate your account.</p>
      <a href="${verificationLink}" class="btn" target="_blank">Verify Email</a>
      <p style="margin-top:25px;">This link will expire in <b>30 minutes</b>.<br>
      If you didn’t create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} <strong>YourAppName</strong>. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
