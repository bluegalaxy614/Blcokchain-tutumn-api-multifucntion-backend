const BetManager = require('../../lib/manager/BetManager');
const HistoryManager = require('../../lib/manager/HistoryManager');
const SocketManager = require('../../lib/manager/SocketManager');
const ServerSocket = require('../../lib/socket/ServerSocket');

module.exports = class BridgeSocket extends ServerSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            console.log(`*** frontend is connected from ${client.id} ***`);

            client.on('disconnect', () => {
                console.log(`### frontend is disconnected from ${client.id} ###`);
                this.removeSocket(client.id);

                const main_socket = SocketManager.getInstance().getClientSocket();
                if(main_socket !== null)
                    main_socket.reportState(false);
            });

            client.on('verify', (data, callback) => {
                this.addClient(data.userId, client.id, 'user');
                
                const main_socket = SocketManager.getInstance().getClientSocket();
                if(main_socket !== null)
                    main_socket.reportState(false);
                
                return callback({
                    status: 'success', 
                    round: HistoryManager.getInstance().getRound(), 
                    histories: HistoryManager.getInstance().getHistories(), 
                    bet: BetManager.getInstance().getBet(data.userId)});
            });

            client.on('bet', (data, callback) => {
                BetManager.getInstance().bet(data, callback);
            });
        });
    }
}