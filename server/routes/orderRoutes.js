const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create an order
router.post('/create', async (req, res) => {
   try {
      const { user, products, totalAmount } = req.body;
      const order = new Order({ user, products, totalAmount });
      await order.save();
      res.status(201).json({ message: "Order placed!", order });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get user orders
router.get('/:userId', async (req, res) => {
   try {
      const orders = await Order.find({ user: req.params.userId });
      res.json(orders);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Update order status
router.put('/update/:id', async (req, res) => {
   try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedOrder) return res.status(404).json({ error: "Order not found!" });
      res.json({ message: "Order updated!", order: updatedOrder });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;