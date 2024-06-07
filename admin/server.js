const config = require('../config');
const SocketManager = require('../lib/manager/SocketManager');
const MainSocket = require('./socket/MainSocket');

const app = require('./adminApp').createApp(config.SERVICE.ADMIN.PORT, config.DB);
const server = require('http').createServer(app);
server.listen(config.SERVICE.ADMIN.PORT, () => {
    console.log('Admin Service is started on ' + config.SERVICE.ADMIN.PORT + ' port');
    SocketManager.getInstance().connectToServer(config.SERVICE.MAIN.HOST, MainSocket);
});