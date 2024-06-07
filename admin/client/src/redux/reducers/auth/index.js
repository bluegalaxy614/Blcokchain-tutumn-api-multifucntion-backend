const preState = {
    isAuth: false,
    userData: {}
};

const userAuth = (state = preState, action) => {
    state = {...state};
    return state;
};

export default userAuth;