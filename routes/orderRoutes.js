const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, cancelOrder, getAdminOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', createOrder);

// User routes
router.get('/user', authenticateToken, getUserOrders);
router.put('/user/:id/cancel', authenticateToken, cancelOrder);

// Admin routes
router.get('/admin', authenticateToken, authorizeRole(['admin', 'superadmin']), getAdminOrders);
router.put('/admin/:id/status', authenticateToken, authorizeRole(['admin', 'superadmin']), updateOrderStatus);

module.exports = router;
