import axios from 'axios';
import ApiConfig from './baseConfig';

export default class PlayerService {
    constructor() {
        axios.interceptors.request.use(
            config => {
                config.baseURL = ApiConfig.Root.apiUrl
                config.headers = {
                    authorization: `Bearer ${this.getToken()}`
                }
                return config
            },
            error => Promise.reject(error)
        )
        axios.interceptors.response.use(
            response => {
                if (response.data.status === 'fail' && response.data.session) {
                    alert(response.data.message)
                    this.clearToken()
                    setTimeout(() => {
                        window.location.assign("/")
                    }, 500);
                }
                return response
            },
            error => Promise.reject(error)
        )
    }

    setToken = data => localStorage.setItem(ApiConfig.token, data)

    getToken = () => localStorage.getItem(ApiConfig.token)

    clearToken = () => localStorage.removeItem(ApiConfig.token)

    /**
     * auth
     */
    userLogin = (...args) => axios.post(ApiConfig.request.userLogin, ...args)

    sessionCheck = () => axios.post(ApiConfig.request.sessionCheck, { token: this.getToken() })

    changePassword = (...args) => axios.post(ApiConfig.request.changePassword, ...args)

    /**
    * report
    */
    loadDashBoardData = (...args) => axios.post(ApiConfig.request.loadDashBoardData, ...args);

    getPlayerdata = (...args) => axios.post(ApiConfig.request.getPlayerdata, ...args);

    deletePlayerData = (...args) => axios.post(ApiConfig.request.deletePlayerData, ...args);

    getPlayerDetail = (...args) => axios.post(ApiConfig.request.getPlayerDetail, ...args);

    getRoundData = (...args) => axios.post(ApiConfig.request.getRoundData, ...args);

    deleteRoundData = (...args) => axios.post(ApiConfig.request.deleteRoundData, ...args);

    getRoundDetail = (...args) => axios.post(ApiConfig.request.getRoundDetail, ...args);

    bonusUser = (...args) => axios.post(ApiConfig.request.bonusUser, ...args);
}