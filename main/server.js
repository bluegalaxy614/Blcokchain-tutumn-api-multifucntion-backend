const config = require('../config');
const SocketManager = require('../lib/manager/SocketManager');
const MainSocket = require('./socket/MainSocket');

const app = require('./mainApp').createApp(config.SERVICE.MAIN.PORT, config.DB);
const server = SocketManager.getInstance().createServer(app, MainSocket);
server.listen(config.SERVICE.MAIN.PORT, () => {
    console.log('Main Service is started on ' + config.SERVICE.MAIN.PORT + ' port');
});