const routerx = require('express-promise-router');
const walletRouter = require('./walletRouter');
const paymentRouter = require ('./paymentRouter');
const userRouter = require ('./userRouter');

const Router = routerx();

Router.use('/api/v0/payment', paymentRouter);
Router.use('/api/auth', walletRouter);
Router.use('/api/v0/user', userRouter);

module.exports = Router;