const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Failed to send email please check our mail : " + err.message);
  }
};

module.exports = sendEmail;
