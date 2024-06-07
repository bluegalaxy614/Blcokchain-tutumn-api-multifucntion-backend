const routerx = require('express-promise-router');
const userController = require('../controllers/userController')

const Router = routerx();

Router.get('/getLeaderBoardData', userController.getLeaderBoardData);

module.exports = Router;