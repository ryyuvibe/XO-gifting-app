// GiftButton.jsx
import React, { useState } from 'react';

export default function GiftButton({ product }) {
  const [isGift, setIsGift] = useState(false);

  // PM Note: This component replaces the standard "Add to Cart" 
  // to capture gifting intent early in the funnel.

  const handlePurchase = async () => {
    // Call our internal micro-service
    await fetch('/api/create-gift', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        senderName: "Ryan Yu", // Dynamic in prod
        recipientPhone: "+14150000000", // Captured via input form
        personalizedMessage: "Enjoy the vegan XO sauce!"
      })
    });
    alert("Gift Sent!");
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <label className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={isGift} 
          onChange={(e) => setIsGift(e.target.checked)} 
        />
        <span className="font-bold text-gray-700">Send as a Gift? 🎁</span>
      </label>

      {isGift && (
        <div className="mt-2 text-sm text-gray-500">
          We'll text the recipient. You don't need their address!
        </div>
      )}

      <button 
        onClick={handlePurchase}
        className="mt-4 w-full bg-black text-white py-2 rounded"
      >
        {isGift ? "Send via SMS" : "Add to Cart"}
      </button>
    </div>
  );
}