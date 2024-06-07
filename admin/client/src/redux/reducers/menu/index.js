const preState = {
    menuCollaps: false,
    menuPathName: ''
};

const menuOption = (state = preState, action) => {
    switch(action.type) {
        case 'SET_MENU_COLLAPS':
            return {
                ...state,
                menuCollaps: action.data
            };
    
        case 'SET_MENU_PATH':
            return {
                ...state,
                menuPathName: action.data
            };
        
        default:
            state = {...state};
            break;
    }
    return state;
};

export default menuOption;