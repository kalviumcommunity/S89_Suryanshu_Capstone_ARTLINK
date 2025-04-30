const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   name: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: Number, required: true },
   image: { type: String, default: '' }, 
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
   createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);