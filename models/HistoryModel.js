const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    round_uuid: { type: String, default: '' },
    userId: { type: String, default: '' },
    betFood: {type: Number},
    betAmount: { type: Number, default: 0 },
    betCurrency: { type: String, default: '' },
    payout: { type: Number, default: 0 },
    result: { type: String, enum: ['win', 'lose'] },
    date: { type: Date, default: new Date() }
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', {virtuals: true});
ModelSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Histories', ModelSchema);