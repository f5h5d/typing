const nodemailer = require('nodemailer');

module.exports = async (name, email, subject, link) => {
  try {

    const emailToSend = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; text-align: left;">
    <h2 style="margin-bottom: 10px;">Verify Your Email for Swifttype</h2>
    <p>Hello ${name},</p>
    <p>Thank you for signing up for Swifttype! To complete your registration, please verify your email by clicking the button below:</p>
    <p>
        <a href="${link}" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
            Verify Email
        </a>
    </p>
    <p>If you did not sign up for Swifttype, you can safely ignore this email.</p>
    <p>This link will expire in <b>60 minutes</b> for security purposes.</p>
    <p>Best regards,<br>The Swifttype Team</p>
</body>
</html>`
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: emailToSend
    })

    console.log("Email Sent");
  } catch (err) { 
    console.log(err);
  }
}