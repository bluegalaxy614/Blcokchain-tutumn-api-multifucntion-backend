const RoundManager = require('../../lib/manager/RoundManager');
const ServerSocket = require('../../lib/socket/ServerSocket');

module.exports = class GameSocket extends ServerSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            console.log(`*** Bridge Service is connected from ${client.id} ***`);

            client.on('disconnect', () => {
                console.log(`### Bridge Service is disconnected from ${client.id} ###`);
                this.removeSocket(client.id);
            });

            client.on('round', (callback) => {
                const round = RoundManager.getInstance().getRound();
                if(round === null)
                    return;

                return callback(round.info());
            });

            client.on('user_bet', (data) => {
                RoundManager.getInstance().setLive(true);
            });
        });
    }
}