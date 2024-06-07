module.exports = class ServerSocket {
    listen_socket = null;
    client_sockets = [];

    constructor(server) {
        this.listen_socket = require('socket.io')({
            cors: {
                origin: '*',
                method: ['GET', 'POST']
            }
        }).listen(server);
    }

    /**************case when frontend is connected*************/
    addClient = (id, socket, type) => {
        if (!id || this.getClient(id) !== null)
            return;

        this.client_sockets.push({id, socket, type});
    }

    getClient = (id) => {
        const index = this.client_sockets.findIndex(client => client.id === id);
        return (index >= 0) ? this.client_sockets[index] : null;
    }

    getClientsByType = (type) => {
        const clients = this.client_sockets.filter(client => {
            return client.type === type;
        });
        return clients;
    }

    sendToClient = (id, packetName, packetData) => {
        let client = this.getClient(id);
        if(!client)
            return;

        this.listen_socket.to(client.socket).emit(packetName, packetData);
    }

    /**********************************************************/

    /***************case when service is connected*************/
    addService = (socket, host, port, count) => {
        if (this.getService(socket) !== null)
            return;

        this.client_sockets.push({socket, host, port, count});
    }

    getService = (socket) => {
        const index = this.client_sockets.findIndex(client => client.socket === socket);
        return (index >= 0) ? this.client_sockets[index] : null;
    }

    getBestService = () => {
        let services = this.client_sockets;
        if (services.length > 0) {
            services.sort(function (a, b) {
                return a.client_count - b.client_count;
            });
            return services[0];
        }
        else {
            return null;
        }
    }

    updateService = (socket, count) => {
        let service = this.getService(socket);
        if(!service)
            return;
        
        service.count = count;
    }

    sendToService = (socket, packetName, packetData) => {
        let service = this.getService(socket);
        if(!service)
            return;

        this.listen_socket.to(service.socket).emit(packetName, packetData);
    }
    /**********************************************************/

    getClients = () => {
        return this.client_sockets;
    }

    removeSocket = (socket) => {
        const index = this.client_sockets.findIndex(client => client.socket === socket);
        if (index >= 0)
            this.client_sockets.splice(index, 1);
    }

    broadCast = (packetName, packetData) => {
        this.listen_socket.emit(packetName, packetData);
    }
}