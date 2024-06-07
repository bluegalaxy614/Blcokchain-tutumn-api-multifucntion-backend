const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config');

const ModelSchema = mongoose.Schema({
    name: { type: String, trim: true, required: [true, 'Please input username.'] },
    password: { type: String, required: [true, 'Please enter a password.']},
    token: { type: String, default: ''},
    timestamp: { type: Number, default: 0}
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals: true });

ModelSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, JWT.decode(this.password).password);
}

ModelSchema.methods.updateToken = function(token) {
    this.token = token;
    this.timestamp = new Date();
    return this.save();
}

ModelSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password'))
            return next();

        this.password = JWT.sign({password: bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))}, config.JWT.secret);
        return next();
    }
    catch(err) {
        console.error({title: 'AdminUserSave', message: err.message});
    }
});

module.exports = mongoose.model('AdminUsers', ModelSchema);