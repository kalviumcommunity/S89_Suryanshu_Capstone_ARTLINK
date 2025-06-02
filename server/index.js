const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const path = require("path");
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const PORT = process.env.PORT || 8080;
const{ protect, adminOnly } = require("./middleware/authMiddleware");
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/products',protect, productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.log("MongoDB connection failed", error);
})


app.get("/",(req, res) => {
    try {
        res.status(200).send({msg:"This is my backend"});
    } catch (error) {
        res.status(500).send({message:"error occured"});
    }
});

// Route to test OAuth
app.get("/test-oauth", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test-oauth.html'));
});

app.listen(5000,async() => {
    try {

        console.log("server connected");
    } catch (error) {
        console.log("server not connected",error);
    }
})
