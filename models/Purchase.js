const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
  });
  
module.exports= mongoose.model('Purchase', PurchaseSchema);