const config = require('../config');
const FoodBot = require('./bot');
const app = require('../lib/app').createApp(config.SERVICE.BOT.PORT);
const server = require('http').createServer(app);

var count = 50;
var bots = [];

var interval = null;

server.listen(config.SERVICE.BOT.PORT, () => {
    console.log('Bot Service is started on ' + config.SERVICE.BOT.PORT + ' port');

    start();
});

start = () => {
    interval = setInterval(() => {
        if(count === 0) {
            clearInterval(interval);
            run();
            return;
        }

        bots.push(new FoodBot());
        count--;
    }, 1000);  
}

run = () => {
    interval = setInterval(() => {
        let run_count = Math.floor(Math.random() * 10);
        while(run_count > 0) {
            bots[Math.floor(Math.random() * bots.length)].work();
            run_count--;
        }

    }, 15000);
}

