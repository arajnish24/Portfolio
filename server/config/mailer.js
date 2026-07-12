import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text, fromName, replyTo }) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const maskSensitiveData = (content) => {
    if (!content) return content;
    let sanitized = String(content);
    // Mask Portfolio Verification Token e.g., PX-8453-9452-ABCD
    sanitized = sanitized.replace(/PX-\d{4}-\d{4}-[A-Z]{4}/g, 'PX-XXXX-XXXX-XXXX');
    // Mask 6-digit OTP codes inside span/td elements or raw text
    sanitized = sanitized.replace(/(letter-spacing:\s*6px;[^>]*?>)(\d{6})(<\/span>)/gs, '$1[HIDDEN]$3');
    sanitized = sanitized.replace(/(font-size:\s*18px;[^>]*?>)(\d{6})(<\/td>)/gs, '$1[HIDDEN]$3');
    sanitized = sanitized.replace(/(Verification Code \(OTP\).*?>)(\d{6})(<\/td>)/gs, '$1[HIDDEN]$3');
    return sanitized;
  };

  if (!smtpUser || !smtpPass) {
    console.log(`\n================= EMAIL DISPATCH SIMULATOR =================`);
    console.log(`[SIMULATION] Sending email to: ${to}`);
    if (replyTo) console.log(`Reply-To: ${replyTo}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`Text Body: ${maskSensitiveData(text)}`);
    if (html) console.log(`HTML Body: \n${maskSensitiveData(html)}`);
    console.log(`============================================================\n`);
    return { simulated: true };
  }

  // Fallback to SMTP_USER if destination is the default mock email
  const recipient = (to && to.trim().toLowerCase() === 'owner@portfolio.com' || !to) ? smtpUser : to;

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"${fromName || process.env.SMTP_FROM_NAME || 'PortfolioX Alerts'}" <${smtpUser}>`,
      to: recipient,
      subject,
      text,
      html,
      replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✔ Email successfully dispatched to ${recipient}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`🔴 Nodemailer failed to send email to ${recipient}:`, error);
    return { success: false, error: error.message };
  }
};
