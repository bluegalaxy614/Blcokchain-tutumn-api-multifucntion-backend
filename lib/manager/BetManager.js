const models = require('../../models/index');
const { STATE } = require("../common/constant");
const HistoryManager = require("./HistoryManager");
const SocketManager = require("./SocketManager");
const config = require('../../config');

module.exports = class BetManager {

    static _instance    = null;

    bets = [];

    static getInstance = () => {
        if(BetManager._instance === null)
            BetManager._instance = new BetManager();

        return BetManager._instance;
    }

    constructor() {

    }

    init = () => {
        this.bets = [];
    }

    getBet = (userId) => {
        const index = this.bets.findIndex(bet => bet.userId === userId);
        return (index >= 0) ? this.bets[index] : null;           
    }

    bet = async (data, callback) => {
        let socket = SocketManager.getInstance().getServerSocket().getClient(data.userId);
        if(!socket)
            return;

        const index = this.bets.findIndex(bet => bet.userId === data.userId);
        if(index >= 0)
            return callback({status: false, message: 'You already bet'});

        let round = HistoryManager.getInstance().getRound();
        if(!round)
            return;

        if(round.state !== STATE.COUNTDOWN) 
            return callback({status: false, message: 'Please wait for the next round.'});

        let user = await models.UserModel.findOne({_id: data.userId});
        if(!user)
            return callback({status: false, message: 'Unauthorized User!!!'});

        if(data.bet.amount > user.balance)
            return callback({status: false, message: 'not enough balance!!!'});

        this.bets.push({
            userId: data.userId,
            pick: data.bet.food,
            amount: data.bet.amount
        });

        user.balance -= data.bet.amount;
        user.save();

        SocketManager.getInstance().getServerSocket().sendToClient(data.userId, 'update_balance', {userId: data.userId, balance: user.balance});
        SocketManager.getInstance().getClientSocket1().send('user_bet', {userId: data.userId});

        return callback({status: true});
    }

    completeBets = async() => {

        const round = HistoryManager.getInstance().getRound();

        for(let index = 0; index < this.bets.length; index++) {
            let bet = this.bets[index];

            let user = await models.UserModel.findOne({_id: bet.userId});
            if(!user)
                continue;

            let isWin = config.RULE.BEAT[bet.pick].includes(round.result.dealer);

            await new models.HistoryModel({
                round_uuid: round.uuid,
                userId: bet.userId,
                betFood: bet.pick,
                betAmount: bet.amount,
                payout: isWin ? config.RULE.PAYOUT : 0,
                result: isWin ? 'win' : 'lose',
                date: new Date()
            }).save();

            if(isWin) {
                user.balance += bet.amount * config.RULE.PAYOUT;
                user.save();
                SocketManager.getInstance().getServerSocket().sendToClient(bet.userId, 'update_balance', {userId: bet.userId, balance: user.balance});
            }
        }

        this.init();
    }
}