const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // Force IPv4

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  await transporter.sendMail({
    from: `"JobTrackr AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;