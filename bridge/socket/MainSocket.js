const ClientSocket = require('../../lib/socket/ClientSocket');
const SocketManager = require('../../lib/manager/SocketManager');
const config = require('../../config');


module.exports = class MainSocket extends ClientSocket {

    online_users = 0;

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log(`***Connected to Main Service ***`);
            this.reportState(true);
        });

        this.socket.on('disconnect', () => {
            console.log(`###Disconnected from Main Service ###`);
        });

        this.socket.on('online_users', (data) => {
            this.online_users = data.count;
            SocketManager.getInstance().broadCast('online_users', {total: this.online_users});
        });

        this.socket.on('update_balance', (data) => {
            SocketManager.getInstance().sendToClient(data.userId, 'update_balance', data);
        });

        this.socket.on('deposit_result', (data) => {
            SocketManager.getInstance().sendToClient(data.userId, 'deposit_result', data);
        });

        this.socket.on('bonus_balance', (data) => {
            SocketManager.getInstance().sendToClient(data.userId, 'bonus_balance', data);
        });
    }

    reportState = (isFirst = false) => {
        let data = {};

        if(isFirst) {
            data.host = config.SERVICE.BRIDGE.HOST;
            data.port = config.SERVICE.BRIDGE.PORT;
        }

        let server_socket = SocketManager.getInstance().getServerSocket();
        data.client_count = (server_socket === null) ? 0 : server_socket.getClients().length;

        this.send('report_state', data);
    }
}