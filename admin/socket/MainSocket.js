const ClientSocket = require('../../lib/socket/ClientSocket');
const SocketManager = require('../../lib/manager/SocketManager');
const config = require('../../config');

module.exports = class MainSocket extends ClientSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log(`***Connected to Main Service ***`);
        });

        this.socket.on('disconnect', () => {
            console.log(`###Disconnected from Main Service ###`);
        });
    }
}