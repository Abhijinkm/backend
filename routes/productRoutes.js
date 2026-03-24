const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/', getProducts);

// Admin only routes
router.post('/admin', authenticateToken, authorizeRole(['admin', 'superadmin']), createProduct);
router.put('/admin/:id', authenticateToken, authorizeRole(['admin', 'superadmin']), updateProduct);
router.delete('/admin/:id', authenticateToken, authorizeRole(['admin', 'superadmin']), deleteProduct);

module.exports = router;
