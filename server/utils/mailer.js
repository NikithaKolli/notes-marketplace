const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendLicenseEmail = async (to, noteTitle, licenseKey, downloadLink) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: `Your License Key for ${noteTitle}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Here is your license key for <strong>${noteTitle}</strong>:</p>
        <div style="background:#f4f4f4;padding:10px;font-size:18px;font-weight:bold;">${licenseKey}</div>
        <p><a href="${downloadLink}">Click here to download your notes</a></p>
      `,
    });
    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Resend email error:', err);
  }
};

module.exports = sendLicenseEmail;