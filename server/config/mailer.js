import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text, fromName, replyTo }) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  let lastError = null;

  const maskSensitiveData = (content) => {
    if (!content) return content;
    let sanitized = String(content);
    // Mask Portfolio Verification Token e.g., PX-8453-9452-ABCD anywhere in the text
    sanitized = sanitized.replace(/PX-\d{4}-\d{4}-[A-Z0-9]{4}/gi, 'PX-XXXX-XXXX-XXXX');
    // Mask any standalone 6-digit OTP codes
    sanitized = sanitized.replace(/\b\d{6}\b/g, '[HIDDEN]');
    return sanitized;
  };

  // Determine final recipient
  const recipient = (to && to.trim().toLowerCase() === 'owner@portfolio.com' || !to) ? (smtpUser || 'owner@portfolio.com') : to;

  // ==========================================
  // HTTP EMAIL PROVIDERS FALLBACK (BYPASSES SMTP TIMEOUTS)
  // ==========================================

  // 1. Brevo HTTP API
  const brevoKey = process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.trim() : null;
  if (brevoKey) {
    const brevoSender = process.env.BREVO_SENDER_EMAIL || smtpUser || 'no-reply@portfolio.com';
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoKey
        },
        body: JSON.stringify({
          sender: { 
            name: fromName || process.env.SMTP_FROM_NAME || 'Portfolio Alerts', 
            email: brevoSender 
          },
          to: [{ email: recipient }],
          subject,
          htmlContent: html,
          textContent: text || 'View HTML version',
          replyTo: replyTo ? { email: replyTo } : undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, messageId: data.messageId || 'brevo-http' };
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    } catch (apiError) {
      console.error('🔴 Brevo HTTP API email dispatch failed:', apiError.message);
      return { success: false, error: `Brevo API Dispatch Error: ${apiError.message}` };
    }
  }

  // 2. Resend HTTP API
  const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
  if (resendKey) {
    const resendSender = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: `${fromName || process.env.SMTP_FROM_NAME || 'Portfolio Alerts'} <${resendSender}>`,
          to: recipient,
          subject,
          html,
          text: text || 'View HTML version',
          reply_to: replyTo
        })
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, messageId: data.id || 'resend-http' };
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    } catch (apiError) {
      console.error('🔴 Resend HTTP API email dispatch failed:', apiError.message);
      return { success: false, error: `Resend API Dispatch Error: ${apiError.message}` };
    }
  }

  // 3. SendGrid HTTP API
  const sendgridKey = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.trim() : null;
  if (sendgridKey) {
    const sendgridSender = process.env.SENDGRID_SENDER_EMAIL || smtpUser || 'no-reply@portfolio.com';
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sendgridKey}`
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: recipient }]
          }],
          from: { 
            email: sendgridSender, 
            name: fromName || process.env.SMTP_FROM_NAME || 'Portfolio Alerts' 
          },
          subject,
          content: [
            { type: 'text/html', value: html },
            { type: 'text/plain', value: text || 'View HTML version' }
          ],
          reply_to: replyTo ? { email: replyTo } : undefined
        })
      });

      if (response.ok) {
        return { success: true, messageId: response.headers.get('x-message-id') || 'sendgrid-http' };
      } else {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }
    } catch (apiError) {
      console.error('🔴 SendGrid HTTP API email dispatch failed:', apiError.message);
      return { success: false, error: `SendGrid API Dispatch Error: ${apiError.message}` };
    }
  }

  // ==========================================
  // RESILIENT SMTP PROTOCOL (FALLBACK IF NO API KEY SET)
  // ==========================================

  if (!smtpUser || !smtpPass) {
    return { success: false, error: lastError ? lastError.message : 'No mail credentials configured (missing SMTP user/pass and HTTP API keys).' };
  }

  const configsToTry = [];

  if (process.env.SMTP_SERVICE) {
    configsToTry.push({
      service: process.env.SMTP_SERVICE,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      tls: { rejectUnauthorized: false }
    });
  }

  // Fallback 1: Port 587 with STARTTLS (usually open and preferred in cloud containers)
  configsToTry.push({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });

  // Fallback 2: Direct SSL on Port 465
  configsToTry.push({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });

  // Fallback 3: Explicit Gmail standard STARTTLS on Port 587 (if user overrode port with something else)
  configsToTry.push({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });

  for (const transportConfig of configsToTry) {
    try {
      const transporter = nodemailer.createTransport(transportConfig);
      
      const mailOptions = {
        from: `"${fromName || process.env.SMTP_FROM_NAME || 'Portfolio Alerts'}" <${smtpUser}>`,
        to: recipient,
        subject,
        text,
        html,
        replyTo
      };

      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.warn(`[MAILER] Failed attempting transport config (Port ${transportConfig.port || 'default'}):`, error.message);
      lastError = error;
    }
  }

  console.error(`🔴 All Nodemailer transport configurations failed to send email to ${recipient}:`, lastError);
  return { success: false, error: lastError ? lastError.message : 'Connection timeout' };
};
