import Config from "../config/index"
import { io } from "socket.io-client";

export default class GameSocketManager {
    static _instance = null;

    socket;

    static getInstance() {
        if (GameSocketManager._instance === null)
            GameSocketManager._instance = new GameSocketManager();

        return GameSocketManager._instance;
    }

    connect() {
        this.socket = io(Config.Root.gameSocketUrl, { transports: ['websocket'] });
        let self = this;

        this.socket.on('connect', function () {
            console.log('Game Socket Connected Successfully!');
        });

        this.socket.on('round', function (response) {
            self.postMessage({ type: 'gamesocket-round', data: response });
        });

        this.socket.on('notify_newbet', function (response) {
            self.postMessage({ type: 'gamesocket-notify_newbet', data: response });
        });

        this.socket.on('notify_closebet', function (response) {
            self.postMessage({ type: 'gamesocket-notify_closebet', data: response });
        });
    }

    postMessage(message) {
        window.postMessage(message, '*');
    }

    disconnect() {
        this.socket.disconnect();
    }

    verifyUser(userId, type = "admin") {
        let self = this;
        this.socket.emit('verify', { userId, type });
        this.socket.emit('last_round', { userId }, (response) => {
            setTimeout(() => {
                self.postMessage({ type: 'gamesocket-last_round', data: response });
            }, 1000);
        })
    }

    confirmBetResult(userId, result) {
        this.socket.emit('confirm_result', { userId, result });
    }

    startRound(userId) {
        this.socket.emit('start_round', { userId });
    }

    refundRound(userId, callback) {
        this.socket.emit('refund_bet', { userId }, (response) => {
            callback(response);
        });
    }
}