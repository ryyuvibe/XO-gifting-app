// smsService.js
// Mocking the Twilio Client
const sendGiftNotification = async (phone, sender, token) => {
  const claimUrl = `https://maison-xo.com/claim?token=${token}`;
  
  const messageBody = `
    🎁 You've received a gift from ${sender}! 
    
    It's waiting for you at Maison XO. 
    Click here to unwrap and choose where to send it: ${claimUrl}
  `;

  console.log(`[SMS SENT to ${phone}]: ${messageBody}`);
  return true;
};

module.exports = { sendGiftNotification };