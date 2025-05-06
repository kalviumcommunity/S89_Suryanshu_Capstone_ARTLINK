const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Place an order (requires authentication)
router.post('/create', protect, async (req, res) => {
   try {
      const { products, totalAmount } = req.body;
      const order = new Order({ user: req.user._id, products, totalAmount });
      await order.save();
      res.status(201).json({ message: "Order placed!", order });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Admin-only access: View all orders
router.get('/all', protect, adminOnly, async (req, res) => {
   try {
      const orders = await Order.find().populate("user", "name email");
      res.json(orders);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;