const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASSWORD } = require("../config");

// Nodemailer setup (nodemailer credentials)
const transporter = nodemailer.createTransport({
  service: "gmail", // Email provider (Gmail, Outlook, etc.)
  auth: {
    user: EMAIL, // Your email address
    pass: EMAIL_PASSWORD, // App password (not normal email password)
  },
});

const sendEmail = async ({ email, subject, text }) => {
  try {
    const mailOptions = {
      from: EMAIL, // sender email (must be the same as the email you use in Nodemailer auth)
      to: email, // receiver's email
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    return;
    throw new Error("Error sending OTP via email. Please try again.");
  }
};
module.exports = { sendEmail };
