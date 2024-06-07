const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    key: { type: String, required: true },
    dataObject: {}
}, { autoIndex: true, timestamps: true });

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Setting', ModelSchema);