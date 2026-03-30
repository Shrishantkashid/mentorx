// backend/testEmail.js
const nodemailer = require("nodemailer");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

// Build transporter based on env, mirroring config/email.js
function createTransporter() {
  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  if (EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
    secure: EMAIL_SECURE ? EMAIL_SECURE === 'true' : false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

const transporter = createTransporter();

async function sendTestEmail() {
  try {
    let info = await transporter.sendMail({
      from: `"BlockLearn Test" <${process.env.EMAIL_USER}>`,
      to: process.env.TEST_EMAIL_TO || process.env.EMAIL_USER,
      subject: "Test Email from BlockLearn",
      text: "If you see this, SMTP works!",
    });

    console.log("✅ Test email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending test email:", error);
  }
}

sendTestEmail();
