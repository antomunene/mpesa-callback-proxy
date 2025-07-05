// server.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

// Your local machine tunnel URL (Cloudflare, Ngrok, etc.)
const LOCAL_CALLBACK_URL = process.env.LOCAL_CALLBACK_URL;

app.post("/callback", async (req, res) => {
  console.log("✅ Received M-Pesa callback:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const forwardRes = await axios.post(LOCAL_CALLBACK_URL, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("📨 Successfully forwarded to local server:", forwardRes.status);
  } catch (err) {
    console.error("❌ Forwarding failed:", err.message);
  }

  res.sendStatus(200); // Always respond OK to M-Pesa
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});
