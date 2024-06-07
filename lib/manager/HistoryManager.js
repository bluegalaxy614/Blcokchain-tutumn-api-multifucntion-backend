const models = require('../../models/index');
const { STATE } = require('../common/constant');

module.exports = class HistoryManager {

    static _instance    = null;

    round = null;
    histories = [];

    static getInstance = () => {
        if(HistoryManager._instance === null)
            HistoryManager._instance = new HistoryManager();

        return HistoryManager._instance;
    }

    constructor() {

    }

    init = async () => {
        try {
            this.histories = await models.RoundModel.find({state: STATE.COMPLETED}, {_id: 0, uuid: 1, number: 1, result: 1}).sort({date: -1}).limit(10);
            // this.histories.reverse();
        }
        catch(err) {
            console.error({title: 'HistoryManager => init', message: err.message});
        }
    }

    setRound = (round) => {
        this.round = round;

        if(this.round.state !== STATE.COMPLETED)
            return false;

        if(this.histories.length !== 0 && this.histories[0].uuid === this.round.uuid)
            return false;

        this.histories.unshift(this.round);
        if(this.histories.length > 10)
            this.histories.splice(10, 1);

        return true;
    }

    getRound = () => {
        return this.round;
    }

    getHistories = () => {
        return this.histories;
    }
}