const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // port 587 kosam false undali
  family: 4,     // IPv4 ni force chesthundi (ENETUNREACH error raakunda)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendLicenseEmail = async (to, noteTitle, licenseKey, downloadLink) => {
  const mailOptions = {
    from: `"Notes Marketplace" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Your License Key for ${noteTitle}`,
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Here is your license key for <strong>${noteTitle}</strong>:</p>
      <div style="background:#f4f4f4;padding:10px;font-size:18px;font-weight:bold;">${licenseKey}</div>
      <p><a href="${downloadLink}">Click here to download your notes</a></p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendLicenseEmail;