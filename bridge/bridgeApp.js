const BetManager = require('../lib/manager/BetManager');
const HistoryManager = require('../lib/manager/HistoryManager');
const SocketManager = require('../lib/manager/SocketManager');
const GameSocket = require('./socket/GameSocket');
const MainSocket = require('./socket/MainSocket');

exports.createApp = (port, db) => {
    const models = require('../models/index');
    const config = require('../config');
    
    const app = require('../lib/app').createApp(port);
    
    models.mongoose.connect(db)
        .then(async () => {
            console.log('server connected to mongodb successfully.');
            
            await HistoryManager.getInstance().init();
            BetManager.getInstance().init();

            SocketManager.getInstance().connectToServer(config.SERVICE.MAIN.HOST, MainSocket);
            SocketManager.getInstance().connectToServer1(config.SERVICE.GAME.HOST, GameSocket);
        })
        .catch((err) => {
            console.error({title: 'mongodb connection error', message: err.message});
            process.exit();
        });

    return app;
}