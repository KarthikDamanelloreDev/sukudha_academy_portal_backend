const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async (toEmail, subject, htmlContent) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { "name": "Sukudha Academy", "email": process.env.BREVO_SENDER_EMAIL };
    sendSmtpEmail.to = [{ "email": toEmail }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully. Returned data: ' + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

const sendOtpEmail = async (email, otp) => {
    const subject = "Your Password Reset OTP - Sukudha Academy";
    const htmlContent = `
        <html>
            <body>
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Use the following OTP to complete the process:</p>
                <h2 style="color: #4F46E5;">${otp}</h2>
                <p>This OTP is valid for 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </body>
        </html>
    `;
    return sendEmail(email, subject, htmlContent);
};

module.exports = { sendEmail, sendOtpEmail };
