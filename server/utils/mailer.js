// Ee file Gmail dwara email pampadaniki
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const sendLicenseEmail = async (toEmail, noteTitle, licenseKey, downloadLink) => {
  await transporter.sendMail({
    from: `"College Notes Marketplace" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Your purchase: ${noteTitle}`,
    html: `
      <h2>Payment Successful!</h2>
      <p><b>Note:</b> ${noteTitle}</p>
      <p><b>License Key:</b> ${licenseKey}</p>
      <p><b>Download:</b> <a href="${downloadLink}">Click here to download</a></p>
    `
  });
};

module.exports = sendLicenseEmail;