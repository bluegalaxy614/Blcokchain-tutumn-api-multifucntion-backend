const config = require('../config');
const SocketManager = require('../lib/manager/SocketManager');
const BridgeSocket = require('./socket/BridgeSocket');

const app = require('./bridgeApp').createApp(config.SERVICE.BRIDGE.PORT, config.DB);
const server = SocketManager.getInstance().createServer(app, BridgeSocket);
server.listen(config.SERVICE.BRIDGE.PORT, () => {
    console.log('Bridge Service is started on ' + config.SERVICE.BRIDGE.PORT + ' port');
});