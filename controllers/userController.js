const Address = require('../models/Address');

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user_id: req.user.id }).sort({ created_at: -1 });
        res.json({ addresses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve addresses' });
    }
};

const addAddress = async (req, res) => {
    const { fullName, phone, street, city, state, pincode } = req.body;
    try {
        const address = await Address.create({ user_id: req.user.id, fullName, phone, street, city, state, pincode });
        res.status(201).json({ message: 'Address added', addressId: address.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add address' });
    }
};

module.exports = { getAddresses, addAddress };
