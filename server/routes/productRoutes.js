const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Only authenticated users can create products
router.post('/create', protect, async (req, res) => {
   try {
      const { name, description, price } = req.body;
      const product = new Product({ name, description, price, createdBy: req.user._id });
      await product.save();
      res.status(201).json({ message: "Product added!", product });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Fetch all products (public access)
router.get('/', async (req, res) => {
   try {
      const products = await Product.find().populate("createdBy", "name email");
      res.json(products);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Only authenticated users can update their own products
router.put('/update/:id', protect, async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);

      if (!product || product.createdBy.toString() !== req.user._id.toString()) {
         return res.status(403).json({ error: "You do not have permission to update this product" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: "Product updated!", product: updatedProduct });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;