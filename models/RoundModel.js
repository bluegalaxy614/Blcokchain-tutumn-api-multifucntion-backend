const mongoose = require('mongoose');
const { MODE, STATE } = require('../lib/common/constant');

const ModelSchema = mongoose.Schema({
    uuid: {type: String, default: ''},
    number: {type: Number, default: 0},
    mode: {type: String, enum: [MODE.DEMO, MODE.LIVE], default: MODE.LIVE},
    serverSeed: {type: String, default: null},
    clientSeed: {type: String, default: null},
    fairData: {type: String, default: null},
    result: {type: Object, default: null},
    state: {type: String, enum: [STATE.PENDING, STATE.COUNTDOWN, STATE.RUN, STATE.COMPLETED], default: STATE.PENDING},
    date: {type: Date, default: new Date()}
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', {virtuals: true});
ModelSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Rounds', ModelSchema);