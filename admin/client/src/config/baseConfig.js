const isLocal = false;
const pro = 'https://admin.foodwarz.gg/admin';
const dev = 'http://192.168.136.41:5003/admin';
const url = isLocal ? dev : pro;

const Config = {
    Root: {
        apiUrl: `${url}`
    },
    token: 'FoodWarz-Admin-Token',
    request: {
        userLogin: '/adminlogin',
        sessionCheck: '/sessionCheck',
        changePassword: '/changepwd',
        loadDashBoardData: '/countData',
        getPlayerdata: '/getGameUsers',
        deletePlayerData: '/deleteGameUser',
        getPlayerDetail: '/getGameUserDetail',
        getRoundData: '/getRounds',
        deleteRoundData: '/deleteRound',
        getRoundDetail: '/getRoundDetail',
        bonusUser:  '/bonusUser'
    }
};

export default Config;