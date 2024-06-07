module.exports = class SocketManager {

    static _instance = null;

    server_socket = null;
    client_socket = null;
    client_socket1 = null;

    static getInstance = () => {
        if(SocketManager._instance === null)
            SocketManager._instance = new SocketManager();

        return SocketManager._instance;
    }

    constructor() {

    }

    createServer(app, ServerSocketClass) {
        const server = require('http').createServer(app);
        this.server_socket = new ServerSocketClass(server);
        return server;
    }

    connectToServer(server, ClientSocketClass) {
        this.client_socket = new ClientSocketClass(server);
    }

    connectToServer1(server, ClientSocketClass) {
        this.client_socket1 = new ClientSocketClass(server);
    }

    getServerSocket = () => {
        return this.server_socket;
    }

    getClientSocket = () => {
        return this.client_socket;
    }

    getClientSocket1 = () => {
        return this.client_socket1;
    }
    
    sendToClient = async(id, packetName, packetData = null) => {
        if(this.server_socket !== null)
            this.server_socket.sendToClient(id, packetName, packetData);
    }

    sendToService = (socket, packetName, packetData = null) => {
        if(this.server_socket !== null)
            this.server_socket.sendToService(socket, packetName, packetData);
    }

    broadCast = (packetName, packetData = null) => {
        if(this.server_socket !== null)
            this.server_socket.broadCast(packetName, packetData);
    }

    sendToServer = (packetName, packetData = null) => {
        if(this.client_socket !== null)
            this.client_socket.send(packetName, packetData);
    }
}