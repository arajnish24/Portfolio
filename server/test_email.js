import dotenv from 'dotenv';
import { sendEmail } from './config/mailer.js';

dotenv.config();

console.log('Testing sendEmail dispatcher...');
console.log('RESEND_API_KEY present:', process.env.RESEND_API_KEY ? 'Yes' : 'No');
console.log('SENDGRID_API_KEY present:', process.env.SENDGRID_API_KEY ? 'Yes' : 'No');
console.log('SMTP_USER / EMAIL_USER present:', (process.env.SMTP_USER || process.env.EMAIL_USER) ? 'Yes' : 'No');

try {
  const result = await sendEmail({
    to: 'arajnish2408@gmail.com',
    subject: 'Portfolio Platform Email Integration Test',
    html: '<h3>Hello!</h3><p>If you see this, your email dispatch system is working successfully!</p>',
    text: 'Hello! Your email dispatch system is working!',
    fromName: 'Portfolio Test'
  });
  console.log('Result:', result);
} catch (error) {
  console.error('Error during test:', error);
}
