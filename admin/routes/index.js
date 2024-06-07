const routerx = require('express-promise-router');
const adminRouter = require('./admin');

const Router = routerx();

Router.use('/admin', adminRouter);

module.exports = Router;