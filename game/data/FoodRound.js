const config = require('../../config');
const { STATE, COUNTDOWN } = require('../../lib/common/constant');
const { hash512 } = require('../../lib/common/helper');
const Round = require('../../lib/data/Round');
const RoundManager = require('../../lib/manager/RoundManager');
const SocketManager = require('../../lib/manager/SocketManager');
const models = require('../../models/index');

module.exports = class FoodRound extends Round {

    countdownTime       = 0;
    countdownInterval   = null;

    constructor (number, serverSeed) {
        super(number, serverSeed);

        this.isAuto = true;
    }

    startCountDown = () =>{
        this.state = STATE.COUNTDOWN;
        this.countdownTime = COUNTDOWN.TIME;

        let self = this;
        this.countdownInterval = setInterval(() => {
            this.countDown(response => {
                if(response.state === STATE.RUN) {
                    self.run();
                }
                else if(response.state === STATE.COUNTDOWN) {
                    self.sendRound();
                    self.countdownTime -= COUNTDOWN.INTERVAL;
                }
            });
        }, COUNTDOWN.INTERVAL * 1000);
    }

    countDown = (callback) => {
        if(this.countdownTime < 0.0) {
            clearInterval(this.countdownInterval);
            this.state = STATE.RUN;
        }

        callback({state: this.state});
    }

    run = () => {
        this.fairData = hash512(this.serverSeed, this.number.toString());
        this.result.dealer = (parseInt(this.fairData[0], 16)) % config.RULE.DEALER.MAX;

        this.sendRound();

        let self = this;
        setTimeout(async() => {
            self.complete();
        }, 2000);
    }

    complete = async () => {
        try {
            this.state = STATE.COMPLETED;
            this.sendRound();
    
            if(RoundManager.getInstance().live()) {
                await new models.RoundModel({
                    uuid: this.id,
                    number: this.number,
                    mode: this.mode,
                    serverSeed: this.serverSeed,
                    fairData: this.fairData,
                    result: this.result,
                    state: this.state,
                    date: new Date()
                }).save();
            }
            
            setTimeout(async() => {
                RoundManager.getInstance().removeRound(this);
                RoundManager.getInstance().createRound(FoodRound);
            }, 3000);
        }
        catch(err) {
            console.error({title: 'FoodRound => complete', message: err.message});
        }
    }

    sendRound = () => {
        SocketManager.getInstance().broadCast('round', {uuid: this.id, state: this.state, count: this.countdownTime.toFixed(2), result: this.result});
    }

    info = () => {
        return {uuid: this.id, state: this.state, count: this.countdownTime.toFixed(2), result: this.result};
    }
}