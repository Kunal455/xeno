import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

const initTransporter = async () => {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`[Mail Service] Initializing SMTP mailer with host ${smtpHost}:${smtpPort}...`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });
  } else {
    console.log('[Mail Service] SMTP credentials not fully defined. Generating Ethereal SMTP test account for sandbox email simulation...');
    try {
      // Create Ethereal test account automatically
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[Mail Service] Ethereal SMTP sandbox account generated:`);
      console.log(`   User: ${testAccount.user}`);
      console.log(`   Pass: ${testAccount.pass}`);

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // Ethereal uses STARTTLS
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (err) {
      console.error('[Mail Service] Failed to create Ethereal SMTP account:', err.message);
      // Fallback: Mock transporter that logs emails to console
      console.log('[Mail Service] Falling back to Mock local console transporter...');
      transporter = {
        sendMail: async (mailOptions) => {
          console.log('[MOCK SMTP] Email log message:');
          console.log(`   From: ${mailOptions.from}`);
          console.log(`   To: ${mailOptions.to}`);
          console.log(`   Subject: ${mailOptions.subject}`);
          console.log(`   Body: ${mailOptions.html || mailOptions.text}`);
          return {
            messageId: `mock-id-${Date.now()}`,
            previewUrl: 'http://localhost:5001/api/receipt/mock-email-preview'
          };
        }
      };
    }
  }

  return transporter;
};

// Auto-initialize on load
initTransporter();

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const activeTransporter = await initTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Xeno CRM" <no-reply@xenocrm.io>',
      to,
      subject,
      html,
      text
    };

    const info = await activeTransporter.sendMail(mailOptions);
    console.log(`[Mail Service] Email sent to ${to}. Message ID: ${info.messageId}`);
    
    // If sent via Ethereal test server, obtain preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Mail Service] Ethereal sandbox preview: ${previewUrl}`);
      return { success: true, messageId: info.messageId, previewUrl };
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Mail Service] Failed to send email to ${to}:`, error.message);
    throw error;
  }
};
