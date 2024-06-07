exports.createApp = (port, db) => {
    const models = require('../models/index');
    const FoodRound = require('./data/FoodRound');
    const RoundManager = require('../lib/manager/RoundManager');

    const app = require('../lib/app').createApp(port);
    
    models.mongoose.connect(db)
        .then(() => {
            console.log('server connected to mongodb successfully.');
            RoundManager.getInstance().start(FoodRound);
        })
        .catch((err) => {
            console.error({title: 'mongodb connection error', message: err.message});
            process.exit();
        });

    return app;
}