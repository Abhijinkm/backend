const Order = require('../models/Order');

const createOrder = async (req, res) => {
    const { items, total, email, paymentMethod, shipping_address, user_id } = req.body;
    if (!items || !total || !email || !paymentMethod) return res.status(400).json({ error: 'Missing required fields' });

    try {
        const order = await Order.create({
            email, total, payment_method: paymentMethod, shipping_address: shipping_address || '',
            user_id: user_id ? user_id : undefined, items
        });
        res.status(201).json({ message: 'Order created successfully', orderId: order.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        await Order.findOneAndUpdate({ _id: req.params.id, user_id: req.user.id }, { status: 'Cancelled' });
        res.json({ message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
};

const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ created_at: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

module.exports = { createOrder, getUserOrders, cancelOrder, getAdminOrders, updateOrderStatus };
