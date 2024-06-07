const routerx = require('express-promise-router');
const walletController = require('../controllers/walletController');

const Router = routerx();

Router.post('/wallet_login', walletController.walletLogin);
Router.post('/userwithdraw', walletController.Withdraw);

module.exports = Router;