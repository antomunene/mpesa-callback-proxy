const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/stk-push', async (req, res) => {
  const { callbackUrl, CheckoutRequestID } = req.body;

  if (!callbackUrl || !CheckoutRequestID) {
    return res.status(400).json({ error: 'callbackUrl and CheckoutRequestID are required' });
  }

  console.log(`📲 Received STK simulation request for CheckoutRequestID: ${CheckoutRequestID}`);
  res.status(200).json({ message: 'Simulating callback shortly...' });

  // Simulated delay (like Safaricom)
  setTimeout(async () => {
    const simulatedCallback = {
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 100 },
              { Name: "MpesaReceiptNumber", Value: "NLJ7RT61SV" },
              { Name: "Balance" },
              { Name: "TransactionDate", Value: 20250704142011 },
              { Name: "PhoneNumber", Value: 254712345678 }
            ]
          }
        }
      }
    };

    try {
      await axios.post(callbackUrl, simulatedCallback, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`✅ Callback sent to ${callbackUrl}`);
    } catch (error) {
      console.error(`❌ Failed to send callback to ${callbackUrl}: ${error.message}`);
    }
  }, 3000); // Delay to mimic real behavior
});

// Optional health check
app.get('/', (req, res) => {
  res.send('✅ M-Pesa Simulator is live.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ M-Pesa Simulator running on port ${PORT}`);
});
