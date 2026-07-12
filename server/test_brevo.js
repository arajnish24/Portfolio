import dotenv from 'dotenv';
import { sendEmail } from './config/mailer.js';

dotenv.config();

console.log('Testing sendEmail helper...');
console.log('BREVO_API_KEY present:', process.env.BREVO_API_KEY ? 'Yes' : 'No');
console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL);

try {
  const result = await sendEmail({
    to: 'arajnish2408@gmail.com',
    subject: 'Portfolio Brevo Integration Test',
    html: '<h3>Hello!</h3><p>If you see this, Brevo HTTP API email dispatch is working successfully!</p>',
    text: 'Hello! Brevo HTTP API is working!',
    fromName: 'Portfolio Test'
  });
  console.log('Result:', result);
} catch (error) {
  console.error('Error during test:', error);
}
