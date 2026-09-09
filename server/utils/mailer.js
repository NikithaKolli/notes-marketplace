const sendLicenseEmail = async (to, noteTitle, licenseKey, downloadLink) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL || "kollinikithareddy46@gmail.com";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "Notes Marketplace", email: senderEmail },
        to: [{ email: to }],
        subject: `Your License Key for ${noteTitle}`,
        htmlContent: `
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
        `
      })
    });

    const result = await response.json();
    console.log("Brevo Direct API Response:", result);
    return result;
  } catch (err) {
    console.error("Brevo Fetch Mail Error:", err.message || err);
  }
};

module.exports = sendLicenseEmail;