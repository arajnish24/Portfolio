import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text, fromName, replyTo }) => {
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const smtpHost = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587);
  const smtpSecure = process.env.EMAIL_SECURE === 'true' || process.env.SMTP_SECURE === 'true';
  const smtpFrom = process.env.EMAIL_FROM || fromName || process.env.SMTP_FROM_NAME || 'Portfolio Alerts';
  let lastError = null;

  const maskSensitiveData = (content) => {
    if (!content) return content;
    let sanitized = String(content);
    // Mask Portfolio Verification Token anywhere in the text
    sanitized = sanitized.replace(/PX-\d{4}-\d{4}-[A-Z0-9]{4}/gi, '[HIDDEN]');
    // Mask any standalone 6-digit OTP codes
    sanitized = sanitized.replace(/\b\d{6}\b/g, '[HIDDEN]');
    return sanitized;
  };

  // Determine final recipient
  const ownerEmail = (process.env.OWNER_EMAIL || smtpUser || 'owner@portfolio.com').trim().toLowerCase();
  const recipient = (!to || to.trim().toLowerCase() === 'owner@portfolio.com' || to.trim().toLowerCase() === ownerEmail)
    ? ownerEmail
    : to;

  // ==========================================
  // HTTP EMAIL PROVIDERS FALLBACK (BYPASSES SMTP TIMEOUTS IN PRODUCTION)
  // ==========================================

  // 2. Resend HTTP API
  const resendKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
  if (resendKey) {
    const resendSender = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';
    try {
      console.log('[MAILER] Attempting email dispatch via Resend HTTP API...');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: smtpFrom.includes('<') ? smtpFrom : `"${smtpFrom}" <${resendSender}>`,
          to: recipient,
          subject,
          html,
          text: text || 'View HTML version',
          reply_to: replyTo
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('[MAILER] Resend HTTP API dispatch successful.');
        return { success: true, messageId: data.id || 'resend-http' };
      } else {
        throw new Error(data.message || JSON.stringify(data));
      }
    } catch (apiError) {
      console.error('🔴 [MAILER] Resend HTTP API email dispatch failed:', apiError.message);
      lastError = apiError;
    }
  }

  // 3. SendGrid HTTP API
  const sendgridKey = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.trim() : null;
  if (sendgridKey) {
    const sendgridSender = process.env.SENDGRID_SENDER_EMAIL || smtpUser;
    try {
      console.log('[MAILER] Attempting email dispatch via SendGrid HTTP API...');
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
            name: smtpFrom 
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
        console.log('[MAILER] SendGrid HTTP API dispatch successful.');
        return { success: true, messageId: response.headers.get('x-message-id') || 'sendgrid-http' };
      } else {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }
    } catch (apiError) {
      console.error('🔴 [MAILER] SendGrid HTTP API email dispatch failed:', apiError.message);
      lastError = apiError;
    }
  }

  // ==========================================
  // RESILIENT SMTP PROTOCOL (FALLBACK LOOP)
  // ==========================================

  if (!smtpUser || !smtpPass) {
    console.warn('[MAILER] SMTP User or Pass not configured. Skipping SMTP attempts.');
    return { success: false, error: lastError ? lastError.message : 'No mail credentials configured (missing SMTP user/pass and HTTP API keys).' };
  }

  const configsToTry = [];

  const emailService = process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE;
  if (emailService) {
    configsToTry.push({
      service: emailService,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      tls: { rejectUnauthorized: false }
    });
  }

  // Fallback 1: Custom/User-specified Host or Port 587
  configsToTry.push({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });

  // Fallback 2: Direct SSL on Port 465
  configsToTry.push({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });

  // Fallback 3: Explicit Gmail standard STARTTLS on Port 587
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
      console.log(`[MAILER] SMTP Connection Attempt: host=${transportConfig.host || transportConfig.service || 'default'}, port=${transportConfig.port || 'default'}, secure=${transportConfig.secure}`);
      const transporter = nodemailer.createTransport(transportConfig);
      
      console.log('[MAILER] Verifying SMTP transporter...');
      await transporter.verify();
      console.log('[MAILER] SMTP transporter verified successfully!');

      const mailOptions = {
        from: `"${smtpFrom}" <${smtpUser}>`,
        to: recipient,
        subject,
        text,
        html,
        replyTo
      };

      console.log(`[MAILER] Sending email via SMTP to ${recipient}...`);
      const info = await transporter.sendMail(mailOptions);
      console.log('[MAILER] SMTP email sent successfully. Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`🔴 [MAILER] SMTP connection/auth failure (Host: ${transportConfig.host || transportConfig.service || 'default'}, Port: ${transportConfig.port || 'default'}):`, error.message || error);
      lastError = error;
    }
  }

  console.error(`🔴 All Nodemailer transport configurations failed to send email to ${recipient}:`, lastError ? lastError.message : 'Connection timeout');
  return { success: false, error: lastError ? lastError.message : 'Connection timeout' };
};
