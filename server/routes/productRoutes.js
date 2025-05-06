const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Create a new product
router.post('/create', async (req, res) => {
   try {
      const { name, description, price } = req.body;
      const product = new Product({ name, description, price });
      await product.save();
      res.status(201).json({ message: "Product added!", product });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get all products
router.get('/', async (req, res) => {
   try {
      const products = await Product.find();
      res.json(products);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Update a product
router.put('/update/:id', async (req, res) => {
   try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ error: "Product not found!" });
      res.json({ message: "Product updated!", product: updatedProduct });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Delete a product
router.delete('/delete/:id', async (req, res) => {
   try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ error: "Product not found!" });
      res.json({ message: "Product deleted!" });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;