import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text, fromName, replyTo }) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const maskSensitiveData = (content) => {
    if (!content) return content;
    let sanitized = String(content);
    // Mask Portfolio Verification Token e.g., PX-8453-9452-ABCD anywhere in the text
    sanitized = sanitized.replace(/PX-\d{4}-\d{4}-[A-Z0-9]{4}/gi, 'PX-XXXX-XXXX-XXXX');
    // Mask any standalone 6-digit OTP codes
    sanitized = sanitized.replace(/\b\d{6}\b/g, '[HIDDEN]');
    return sanitized;
  };

  if (!smtpUser || !smtpPass) {
    return { simulated: true };
  }

  // Fallback to SMTP_USER if destination is the default mock email
  const recipient = (to && to.trim().toLowerCase() === 'owner@portfolio.com' || !to) ? smtpUser : to;

  try {
    const transportConfig = {
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    };

    if (process.env.SMTP_SERVICE) {
      transportConfig.service = process.env.SMTP_SERVICE;
    } else {
      transportConfig.host = process.env.SMTP_HOST || 'smtp.gmail.com';
      transportConfig.port = parseInt(process.env.SMTP_PORT) || 587;
      transportConfig.secure = process.env.SMTP_SECURE === 'true';
    }

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: `"${fromName || process.env.SMTP_FROM_NAME || 'PortfolioX Alerts'}" <${smtpUser}>`,
      to: recipient,
      subject,
      text,
      html,
      replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`🔴 Nodemailer failed to send email to ${recipient}:`, error);
    return { success: false, error: error.message };
  }
};
