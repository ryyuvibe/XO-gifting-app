// server.js
const express = require('express');
const smsService = require('./smsService');
const app = express();
app.use(express.json());

// DATABASE MOCK (In production, this would be PostgreSQL/Supabase)
const giftOrders = [];

/**
 * POST /api/create-gift
 * Triggered when a customer purchases a "Gift" item on Shopify.
 */
app.post('/api/create-gift', async (req, res) => {
  const { senderName, recipientPhone, productId, personalizedMessage } = req.body;

  // 1. Generate a unique claim token
  const claimToken = Math.random().toString(36).substring(7);

  // 2. Store the order with "PENDING_ADDRESS" status
  const newOrder = {
    id: giftOrders.length + 1,
    productId,
    status: 'PENDING_ADDRESS', // PM Note: This status prevents WMS from shipping immediately
    claimToken,
    senderName,
    recipientPhone,
    message: personalizedMessage,
    createdAt: new Date()
  };
  
  giftOrders.push(newOrder);

  // 3. Trigger the SMS Service (The "Digital Unwrapping")
  try {
    await smsService.sendGiftNotification(recipientPhone, senderName, claimToken);
    res.status(200).json({ success: true, orderId: newOrder.id });
  } catch (error) {
    res.status(500).json({ error: 'SMS Gateway Failed' });
  }
});

/**
 * POST /api/claim-gift
 * Triggered when the recipient opens the link and enters their address.
 */
app.post('/api/claim-gift', (req, res) => {
  const { claimToken, address, deliveryDate, refuseGift } = req.body;
  
  const order = giftOrders.find(o => o.claimToken === claimToken);

  if (!order) return res.status(404).json({ error: 'Invalid Token' });

  if (refuseGift) {
    order.status = 'REFUSED';
    // PM Note: Trigger refund logic for Sender here
    return res.status(200).json({ message: 'Gift refused. Sender notified.' });
  }

  // Update order with real address and push to Fulfillment Center
  order.address = address;
  order.deliveryDate = deliveryDate;
  order.status = 'READY_TO_SHIP';

  res.status(200).json({ success: true, message: 'Gift is on the way!' });
});

app.listen(3000, () => console.log('Maison XO Gifting Service running on port 3000'));