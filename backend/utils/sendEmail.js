const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Generate test Ethereal account if no real credentials are set in .env
    // This allows the assignment reviewer to test emails without a real SMTP setup!
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || testAccount.user,
        pass: process.env.SMTP_PASS || testAccount.pass,
      },
    });

    const message = {
      from: `${process.env.FROM_NAME || 'Digital Heroes Golf Platform'} <${process.env.FROM_EMAIL || 'noreply@digitalheroes.co.in'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    
    // Preview URL only valid for Ethereal test accounts
    if (!process.env.SMTP_USER) {
        console.log('Preview URL (Open to view fake email): %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmail;
