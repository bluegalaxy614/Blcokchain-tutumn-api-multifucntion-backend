const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    address: { type: String, default: '', required: [true, 'Please input wallet address'] },
    pumpAddress: {type:String, default: ''},
    currency: { type: String, default: '' },
    balance: {type: Number, default: 100 },
    type: { type: String, enum: ['user', 'admin'], default: 'user' },
    name: { type: String, default: '' },
    avatar: { type: String, default: 'avatar1.png' },
    level: { type: Number, default: 0 },
    token: { type: String },
    bonus: {type: Boolean, default: false}
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Users', ModelSchema);