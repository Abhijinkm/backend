const mongoose = require('mongoose');

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

const OrderItemSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
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

module.exports = mongoose.model('Order', OrderSchema);
