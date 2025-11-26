# WhatsApp Web Automation Bot  
*(Node.js + WhatsApp-Web.js + LocalAuth + Express API)*

A fully functional WhatsApp automation bot that uses **WhatsApp Web** to receive and send messages programmatically.  
The bot also exposes a REST API, making it possible to trigger WhatsApp messages from **Postman, Thunder Client, n8n, or any external system**.

---

## Project Overview

This project implements:

- **WhatsApp Web automation** using `whatsapp-web.js`
- **LocalAuth** for persistent login (no QR scan after first time)
- **Express.js REST API**  
- **Auto-reply system**
- **Integration-ready bot** for n8n and other automation platforms

---

## Features

- Receive WhatsApp messages in real-time  
- Auto-reply to specific triggers (e.g., "hi", "hello", "hey")  
- Secure REST API to send WhatsApp messages  
- Persistent login  
- Perfect base for chatbots, schedulers, automation workflows  

---

## Project Structure

```
whatsapp-bot/
│
├── index.js           # Main bot + API server
├── package.json       # Dependencies
├── .gitignore         # Prevents private auth data from being committed
└── .wwebjs_auth/      # Auto-generated — DO NOT upload to GitHub
```

---

## 🛠 Installation

### Install dependencies  
```bash
npm init -y
npm install whatsapp-web.js qrcode-terminal express
```

---

## Running the Bot

```bash
node index.js
```

- First run → QR code appears (scan with your phone)
- Next runs → Auto-login using LocalAuth

---

## Testing the API

### **POST** `http://localhost:3000/send-message`

#### **Body (JSON):**

```json
{
  "number": "961XXXXXXXX",
  "message": "This is a test message!"
}
```

#### Expected Response:
```json
{
  "status": "Message sent",
  "to": "961XXXXXXXX"
}
```

---

## Full `index.js` Code

```javascript
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");

// EXPRESS SETUP
const app = express();
app.use(express.json());
let WHATSAPP_CLIENT = null;

// WHATSAPP CLIENT SETUP (WINDOWS FIX WITH CHROME PATH)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", 
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--disable-gpu",
            "--disable-infobars",
            "--disable-session-crashed-bubble",
            "--no-first-run",
            "--start-maximized"
        ]
    }
});

// QR EVENT
client.on("qr", (qr) => {
    console.log("QR
