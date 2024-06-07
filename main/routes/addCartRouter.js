const routerx = require('express-promise-router');
const btcPayController = require('../controllers/btcPayController.js')

const Router = routerx();

Router.post('/webhook-handler', btcPayController.btcWebhook);

module.exports = Router;