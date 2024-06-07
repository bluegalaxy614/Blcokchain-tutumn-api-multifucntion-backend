const { v4: uuidv4 } = require('uuid');
const config = require('../config');

module.exports = class FoodBot {

    id      = null;
    socket  = null;

    constructor() {
        this.connect();
    }

    connect = () => {
        this.socket = require('socket.io-client').connect(config.SERVICE.BRIDGE.HOST);
        this.socket.on('connect', () => {
            this.verify();
        });
    }

    disconnect = () => {
        this.socket.disconnect();
        this.socket = null;
    }

    verify = () => {
        this.id = uuidv4();

        this.socket.emit('verify', {userId: this.id}, (response) => {
        });
    }

    work = () => {
        if(this.socket === null)
            this.connect();
        else
            this.disconnect();
    }
}