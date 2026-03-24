const express = require('express');
const router = express.Router();
const { getAddresses, addAddress } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/addresses', authenticateToken, getAddresses);
router.post('/addresses', authenticateToken, addAddress);

module.exports = router;
