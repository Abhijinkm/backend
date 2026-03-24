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

const AddressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, schemaOptions);

module.exports = mongoose.model('Address', AddressSchema);
