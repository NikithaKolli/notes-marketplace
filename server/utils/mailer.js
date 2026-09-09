const Brevo = require('@getbrevo/brevo');

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendLicenseEmail = async (to, noteTitle, licenseKey, downloadLink) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `Your License Key for ${noteTitle}`;
    sendSmtpEmail.htmlContent = `
      <h2>Thank you for your purchase!</h2>
      <p>Here is your license key for <strong>${noteTitle}</strong>:</p>
      <div style="background:#f4f4f4;padding:12px;font-size:18px;font-weight:bold;letter-spacing:1px;">
        ${licenseKey}
      </div>
      <p style="margin-top:15px;">
        <a href="${downloadLink}" style="background:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:4px;">
          Click here to download your notes
        </a>
      </p>
    `;
    sendSmtpEmail.sender = {
      name: "Notes Marketplace",
      email: process.env.SENDER_EMAIL || "kollinikithareddy46@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo Email sent successfully to:', to, response);
    return response;
  } catch (err) {
    console.error('Brevo Email error:', err.response ? err.response.body : err.message);
  }
};

module.exports = sendLicenseEmail;