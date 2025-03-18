require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: "Missing required fields: to, subject, text" });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`MCP Email Server running on port ${PORT}`);
});
