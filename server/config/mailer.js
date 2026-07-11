import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log(`\n================= EMAIL DISPATCH SIMULATOR =================`);
    console.log(`[SIMULATION] Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    if (text) console.log(`Text Body: ${text}`);
    if (html) console.log(`HTML Body: \n${html}`);
    console.log(`============================================================\n`);
    return { simulated: true };
  }

  // Fallback to SMTP_USER if destination is the default mock email
  const recipient = (to === 'owner@portfolio.com' || !to) ? smtpUser : to;

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
      from: `"${process.env.SMTP_FROM_NAME || 'PortfolioX Alerts'}" <${smtpUser}>`,
      to: recipient,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✔ Email successfully dispatched to ${recipient}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`🔴 Nodemailer failed to send email to ${recipient}:`, error);
    return { success: false, error: error.message };
  }
};
