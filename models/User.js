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

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' }
}, schemaOptions);

module.exports = mongoose.model('User', UserSchema);
