const { randomCode } = require('../common/helper');
const { SEED_TYPE } = require('../common/constant');
const models = require('../../models/index');

module.exports = class RoundManager {

    static _instance    = null;

    lastRoundNumber     = null;
    serverSeed          = null;

    rounds              = [];

    isLive              = false;

    static getInstance = () => {
        if(RoundManager._instance === null)
            RoundManager._instance = new RoundManager();

        return RoundManager._instance;
    }

    constructor() {

    }

    start = async (RoundClass) => {
        await this.init();
        this.createRound(RoundClass);
    }

    init = async () => {
        try {
            const lastRound = await models.RoundModel.find().sort({date: -1}).limit(1);
            this.lastRoundNumber = (lastRound.length !== 0) ? lastRound[0].number : 0;

            const serverSeed = await models.SeedModel.find({type: SEED_TYPE.SERVER}).sort({date: -1}).limit(1);
            if(serverSeed.length !== 0) {
                this.serverSeed = serverSeed[0].seed;
            }
            else {
                this.serverSeed = randomCode(64);
                await new models.SeedModel({seed: this.serverSeed, type: SEED_TYPE.SERVER, date: new Date()}).save();
            }
        }
        catch(err) {
            console.error({title: 'RoundManager => init', message: err.message});
        }
    }

    createRound = (RoundClass) => {

        this.lastRoundNumber++;
        this.isLive = false;
        
        let round = new RoundClass(this.lastRoundNumber, this.serverSeed);
        this.addRound(round);
        round.sendRound();

        if(round.isAuto)
            round.startCountDown();
    }

    addRound = (round) => {
        const roundIndex = this.rounds.findIndex(element => element.id === round.id);
        if(roundIndex < 0)
            this.rounds.push(round);
    }

    removeRound = (round) => {
        const roundIndex = this.rounds.findIndex(element => element.id === round.id);
        if(roundIndex >= 0)
            this.rounds.splice(roundIndex, 1);
    }

    getRound = () => {
        return (this.rounds.length === 0) ? null : this.rounds[this.rounds.length - 1];
    }

    setLive = (value) => {
        this.isLive = value;
    }

    live = () => {
        return this.isLive;
    }
}