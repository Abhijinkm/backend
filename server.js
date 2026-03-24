const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Note: Frontend is now separate and not served by this express app natively.
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);

// Basic health check
app.get('/', (req, res) => {
    res.json({ message: 'Etmek API backend is running.' });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Backend API Server is running on http://127.0.0.1:${PORT}`);
});
