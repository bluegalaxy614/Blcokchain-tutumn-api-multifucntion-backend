const { v4: uuidv4 } = require('uuid');
const { STATE, MODE } = require('../common/constant');

module.exports = class Round {
    id          = null;
    number      = 0;
    mode        = null;
    serverSeed  = null;
    state       = null;
    isAuto      = false;
    
    fairData    = null;
    result      = {};

    constructor(number, serverSeed) {
        this.id = uuidv4();
        this.number = number;
        this.mode = MODE.LIVE;
        this.serverSeed = serverSeed;
        this.state = STATE.PENDING;
    }
}