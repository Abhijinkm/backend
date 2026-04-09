const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

// Global schema transform to convert _id to id
const schemaOptions = {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    timestamps: { createdAt: 'created_at', updatedAt: false }
};

// --- Models ---

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' }
}, schemaOptions);

const AddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, schemaOptions);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image_url: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 }
}, schemaOptions);

const OrderItemSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image_url: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    total: { type: String, required: true },
    payment_method: { type: String, required: true },
    status: { type: String, default: 'Ordered' },
    shipping_address: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema]
}, schemaOptions);

const User = mongoose.model('User', UserSchema);
const Address = mongoose.model('Address', AddressSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

// Pre-create superadmin
async function seedSuperAdmin() {
    try {
        const superadminExists = await User.findOne({ email: 'superadmin@etmek.com' });
        if (!superadminExists) {
            const superadminHash = '$2b$10$wT.fB.xK1Q06i91v66dK/eiT7O8XW9OQqNKVf.Q8s8iI8c8n9Wz5K';
            await User.create({
                email: 'superadmin@etmek.com',
                password_hash: superadminHash,
                role: 'superadmin'
            });
            console.log('Superadmin user created.');
        }
    } catch (err) {
        console.error('Error seeding superadmin', err);
    }
}
seedSuperAdmin();

module.exports = { mongoose, User, Address, Product, Order };
