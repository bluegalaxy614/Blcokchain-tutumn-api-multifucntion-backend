const ServerSocket = require('../../lib/socket/ServerSocket');

module.exports = class MainSocket extends ServerSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            console.log(`*** bridge service is connected from ${client.id} ***`);

            client.on('disconnect', () => {
                console.log(`### bridge service is disconnected from ${client.id} ###`);
                this.removeSocket(client.id);
            });

            client.on('report_state', (data) => {
                if(data.hasOwnProperty('host') && data.hasOwnProperty('port'))
                    this.addService(client.id, data.host, data.port, data.client_count);
                else
                    this.updateService(client.id, data.client_count);

                this.broadCast('online_users', this.totalOnlineUsers());
            });

            client.on('bonus_balance', (data) => {
                this.broadCast('bonus_balance', data);
            });
        });
    }

    totalOnlineUsers = () => {
        let data = {
            count: 0
        }

        this.client_sockets.forEach(service => {
            data.count += service.count;
        });

        return data;
    }
}