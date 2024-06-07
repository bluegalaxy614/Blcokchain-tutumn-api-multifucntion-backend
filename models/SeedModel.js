const mongoose = require('mongoose');
const { SEED_TYPE } = require('../lib/common/constant');

const ModelSchema = mongoose.Schema({
    seed: {type: String, required: true},
    type: {type: String, required: true, enum: [SEED_TYPE.SERVER, SEED_TYPE.CLIENT], default: SEED_TYPE.SERVER},
    date: {type: Date, default: new Date()}
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Seeds', ModelSchema);