const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Don't use host/port if using service
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            secure: false, // important for Gmail over port 587
            tls: {
                rejectUnauthorized: false // fixes self-signed cert error
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || `<p>${options.text}</p>`
        });

        console.log("✅ Email sent successfully to", options.to);
    } catch (error) {
        console.error("Email error:", error.message);
        console.error(error); //  Add this to see the full stack
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;
