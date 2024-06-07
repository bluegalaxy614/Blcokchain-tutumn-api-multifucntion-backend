const ClientSocket = require('../../lib/socket/ClientSocket');
const SocketManager = require('../../lib/manager/SocketManager');
const config = require('../../config');
const HistoryManager = require('../../lib/manager/HistoryManager');
const BetManager = require('../../lib/manager/BetManager');


module.exports = class GameSocket extends ClientSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log(`***Connected to Game Service ***`);

            this.call('round', this.onRound);
        });

        this.socket.on('disconnect', () => {
            console.log(`###Disconnected from Game Service ###`);
        });

        this.socket.on('round', (data) => {
            this.onRound(data);
        });
    }

    onRound = (data) => {
        let updateHistory = HistoryManager.getInstance().setRound(data);

        SocketManager.getInstance().broadCast('round', HistoryManager.getInstance().getRound());

        if(updateHistory) {
            BetManager.getInstance().completeBets();
            SocketManager.getInstance().broadCast('round_history', HistoryManager.getInstance().getHistories());
        }
    } 
}