import { combineReducers } from 'redux';
import UserAuthReducer from './auth/index';
import CustomizationReducer from './customization/index';
import MenuReducer from './menu/index';

const rootReducer = combineReducers({
    userAuth: UserAuthReducer,
    customization: CustomizationReducer,
    menuOption: MenuReducer
});

export default rootReducer;