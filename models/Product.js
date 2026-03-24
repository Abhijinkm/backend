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

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image_url: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 }
}, schemaOptions);

module.exports = mongoose.model('Product', ProductSchema);
