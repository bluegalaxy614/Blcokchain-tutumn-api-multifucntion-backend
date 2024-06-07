const crypto = require('crypto');

exports.randomCode = (length = 12) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

exports.hash512 = (key, message) => {
    return crypto.createHmac('sha512', key).update(message).digest('hex');
}