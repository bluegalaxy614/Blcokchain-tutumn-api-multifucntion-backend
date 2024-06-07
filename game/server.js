const config = require('../config');
const SocketManager = require('../lib/manager/SocketManager');
const GameSocket = require('./socket/GameSocket');

const app = require('./gameApp').createApp(config.SERVICE.GAME.PORT, config.DB);
const server = SocketManager.getInstance().createServer(app, GameSocket);

server.listen(config.SERVICE.GAME.PORT, () => {
    console.log('Game Service is started on ' + config.SERVICE.GAME.PORT + ' port');
});