const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
       next();
    } else {
       res.status(403).json({ error: "Admin access required" });
    }
 };
 
 module.exports = { protect, adminOnly };

const protect = async (req, res, next) => {
   try {
      // Check if the request has a token
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
         return res.status(401).json({ error: "Access denied, no token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
   } catch (error) {
      res.status(401).json({ error: "Invalid or expired token" });
   }
};

module.exports = protect;