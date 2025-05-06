const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Send a message
router.post('/send', async (req, res) => {
   try {
      const { sender, receiver, content } = req.body;
      const message = new Message({ sender, receiver, content });
      await message.save();
      res.status(201).json({ message: "Message sent!", message });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Get messages between two users
router.get('/:senderId/:receiverId', async (req, res) => {
   try {
      const messages = await Message.find({
         sender: req.params.senderId,
         receiver: req.params.receiverId,
      }).sort({ createdAt: 1 });
      res.json(messages);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

module.exports = router;