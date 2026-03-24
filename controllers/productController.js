const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ created_at: -1 });
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

const createProduct = async (req, res) => {
    const { name, price, description, image_url, category, stock } = req.body;
    try {
        const product = await Product.create({ name, price, description, image_url, category, stock: stock || 10 });
        res.status(201).json({ message: 'Product created', productId: product.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};

const updateProduct = async (req, res) => {
    const { name, price, description, image_url, category, stock } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, { name, price, description, image_url, category, stock });
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
