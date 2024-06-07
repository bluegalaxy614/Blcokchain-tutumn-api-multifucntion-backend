import Config from 'config/index';

export const userLogin = async (data) => {
    const response = await Config.Api.userLogin(data);
    return response.data;
}

export const sessionCheck = async () => {
    const token = Config.Api.getToken();
    if(!token)
        return;

    const scData = await Config.Api.sessionCheck();
    if(!scData.data.status)
        return { userAuth: {isAuth: false} };

    return { userAuth: {isAuth: true, userData: scData.data.data} };
}

export const changePassword = async (data) => {
    const response = await Config.Api.changePassword(data);
    return response.data;
}

