const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);

const models = {};
models.mongoose = mongoose;
models.AdminUserModel = require('./AdminUserModel');
models.HistoryModel = require('./HistoryModel');
models.RoundModel = require('./RoundModel');
models.SeedModel = require('./SeedModel');
models.SettingModel = require('./SettingModel');
models.TransactionModel = require('./TransactionModel');
models.UserModel = require('./UserModel');

module.exports = models;