const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// Add a review
router.post('/create', async (req, res) => {
   try {
      const { user, product, rating, comment } = req.body;
      const review = new Review({ user, product, rating, comment });
      await review.save();
      res.status(201).json({ message: "Review added!", review });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
   try {
      const reviews = await Review.find({ product: req.params.productId });
      res.json(reviews);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;