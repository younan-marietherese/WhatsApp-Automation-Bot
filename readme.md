# WhatsApp Web Automation Bot (Node.js + whatsapp-web.js + LocalAuth)

## Project Overview
This project implements a fully functional automation bot using **WhatsApp Web**, built with:

- **Node.js**
- **whatsapp-web.js**
- **LocalAuth (session persistence)**
- **Express.js API endpoint**
- **Thunder Client / Postman testing**

The bot can:
- Receive incoming WhatsApp messages
- Auto‑reply to specific triggers (e.g., “hi”)
- Send WhatsApp messages using a REST API from any system
- Integrate with automation platforms like **n8n**

---

## Features
- Auto‑reply logic
- REST API for sending WhatsApp messages
- Persistent WhatsApp login (no QR every run)
- Perfect for automation workflows

---

## Project Structure
```
whatsapp-bot/
│
├── index.js
├── package.json
└── .wwebjs_auth/   # auto‑generated LocalAuth session folder
```

---

## Installation

```bash
npm init -y
npm install whatsapp-web.js qrcode-terminal express
```

---

## Running the bot
```bash
node index.js
```

First time → scans QR  
Next runs → auto‑login

---

## Testing the API

**POST** `http://localhost:3000/send-message`  
Body (JSON):

```json
{
  "number": "961XXXXXXXX",
  "message": "This is a test message!"
}
```

---

## index.js (Insert your full code)

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
    console.log("QR RECEIVED");
    qrcode.generate(qr, { small: true });
});

// READY EVENT
client.on("ready", () => {
    console.log("WhatsApp Bot is ready!");
    WHATSAPP_CLIENT = client;
});

// MESSAGE LISTENER
client.on("message", async (msg) => {
    console.log("Message received:", msg.body);

    const text = msg.body.trim().toLowerCase();

    if (["hi", "hello", "hey"].includes(text)) {
        await msg.reply("Hello! I'm your automated bot.");
        console.log("Bot replied: Hello!");
    }
});

client.initialize();

// -------------------------
// API ENDPOINTS
// -------------------------

app.get("/", (req, res) => {
    res.send({ status: "WhatsApp API is running" });
});

app.post("/send-message", async (req, res) => {
    const { number, message } = req.body;

    if (!WHATSAPP_CLIENT) {
        return res.status(400).send({ error: "WhatsApp client not ready" });
    }

    try {
        await WHATSAPP_CLIENT.sendMessage(`${number}@c.us`, message);
        res.send({ status: "Message sent", to: number });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.toString() });
    }
});

// START SERVER
app.listen(3000, () => {
    console.log("API Server running on http://localhost:3000");
});


---


