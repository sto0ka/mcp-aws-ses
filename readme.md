---
title: "MCP Email Server Setup Guide on Ubuntu"
date: 2025-03-18 00:00:00 +0000
categories: [Email, MCP, Node.js]
tags: [Ubuntu, Node.js, Email Server, AWS SES, SMTP]
---

# MCP Email Server Setup

This guide provides a **step-by-step installation** of an **MCP (Model Context Protocol) Email Server** on Ubuntu using **Node.js** and **AWS SES**.

---

## Step 1: Install Required Dependencies

Before starting, ensure your system is up-to-date and install Node.js along with npm.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm
```

Verify the installations:

```bash
node -v
npm -v
```

---

## Step 2: Set Up the MCP Server Directory

Create and navigate to the project directory:

```bash
mkdir mcp-server && cd mcp-server
```

---

## Step 3: Initialize the Node.js Project

Initialize a new Node.js project:

```bash
npm init -y
```

---

## Step 4: Install Necessary Packages

Install the required packages:

```bash
npm install express nodemailer dotenv
```

---

## Step 5: Configure Environment Variables

Create a `.env` file to store environment variables:

```bash
nano .env
```

Add the following content:

```ini
SMTP_HOST=email-smtp.us-east-1.amazonaws.com  #Update to your region
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=your-verified-email@example.com
```

**Save & exit** (`CTRL + X`, then `Y`, then `ENTER`).

---

## Step 6: Develop the MCP Email Server

Create a `server.js` file:

```bash
nano server.js
```

Paste the following code:

```javascript
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
```

**Save & exit** (`CTRL + X`, then `Y`, then `ENTER`).

---

## Step 7: Run the MCP Email Server

Start the server:

```bash
node server.js
```

You should see:

```
MCP Email Server running on port 3001
```

---

## Step 8: Install PM2 for Process Management

Install PM2 globally to manage the server process:

```bash
sudo npm install -g pm2
```

---

## Step 9: Run the Server with PM2

Start the server using PM2:

```bash
pm2 start server.js --name mcp-server
```

Save the PM2 process list:

```bash
pm2 save
```

Set PM2 to start on system boot:

```bash
pm2 startup
```

---

## Step 10: Test the MCP Email Server

Use `curl` to test the email endpoint:

```bash
curl -X POST http://localhost:3001/send-email \
-H "Content-Type: application/json" \
-d '{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "text": "Hello! This is a test email from the MCP server."
}'
```

If configured correctly, you should receive the test email.

---

**Note:** Ensure that your AWS SES credentials are correctly set in the `.env` file and that the email addresses used are verified in your AWS SES account.
