const User = require('../models/User');
const Address = require('../models/Address');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const registerUser = async (req, res) => {
    const { email, password, fullName, phone, street, city, state, pincode } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ error: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password_hash: hashedPassword, role: 'user' });

        if (fullName && phone && street && city && state && pincode) {
            await Address.create({ user_id: user._id, fullName, phone, street, city, state, pincode });
            res.status(201).json({ message: 'User registered with address successfully', userId: user.id });
        } else {
            res.status(201).json({ message: 'User registered successfully', userId: user.id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, role: user.role, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { registerUser, loginUser };
