const routerx = require('express-promise-router');
const adminController = require('../controllers/adminController');

const Router = routerx();

Router.post('/adminlogin', adminController.adminLogin);
Router.post('/sessionCheck', adminController.sessionCheck);
Router.post('/countData', adminController.countData);
Router.post('/getGameUsers', adminController.getGameUsers);
Router.post('/deleteGameUser', adminController.deleteGameUser);
Router.post('/getGameUserDetail', adminController.getGameUserDetail);
Router.post('/getRounds', adminController.getRounds);
Router.post('/deleteRound', adminController.deleteRound);
Router.post('/getRoundDetail', adminController.getRoundDetail);
Router.post('/bonusUser', adminController.bonusUser);

module.exports = Router;