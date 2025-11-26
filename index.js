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
        await msg.reply("Hello! 👋 I'm your automated bot.");
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
