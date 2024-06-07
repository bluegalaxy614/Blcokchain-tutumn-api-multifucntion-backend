const routerx = require('express-promise-router');
const tatumController = require('../controllers/tatumController')

const Router = routerx();

Router.post('/webhook-handler', tatumController.tatumWebhook);

module.exports = Router;