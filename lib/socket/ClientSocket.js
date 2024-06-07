module.exports = class ClientSocket {
    socket = null;

    constructor(server) {
        this.socket = require('socket.io-client').connect(server);
    }

    send = (packetName, packetData) => {
        if(!this.socket.connected)
            return;

        this.socket.emit(packetName, packetData);
    }

    call = (packetname, callback) => {
        if(!this.socket.connected)
            return;

        this.socket.emit(packetname, (response) => {
            return callback(response);
        });
    }
}