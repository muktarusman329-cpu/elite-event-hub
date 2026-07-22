import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates a Nodemailer transporter using environment variables.
 *
 * Expected .env variables:
 *   EMAIL_USER - email address used as sender
 *   EMAIL_PASS - password or app password for the email account
 *   EMAIL_SERVICE (optional) - e.g., 'gmail'. Defaults to 'gmail'.
 */
const getTransporter = () => {
  const service = process.env.EMAIL_SERVICE || 'gmail';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.error('Email credentials are missing in .env');
    return null;
  }
  return nodemailer.createTransport({
    service,
    auth: { user, pass },
  });
};

/**
 * Sends an email to a recipient.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - HTML content of the email.
 */
export const sendGuestEmail = async (to, subject, html) => {
  const transporter = getTransporter();
  if (!transporter) return;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

export default { sendGuestEmail };
