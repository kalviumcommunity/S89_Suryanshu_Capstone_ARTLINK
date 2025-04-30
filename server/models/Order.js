const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
   totalAmount: { type: Number, required: true },
   status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
   createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);