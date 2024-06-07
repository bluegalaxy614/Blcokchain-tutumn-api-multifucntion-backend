import config from '../../../config/themeConfig';

export const initialState = {
    fontFamily: config.themeConfig.fontFamily,
    borderRadius: config.themeConfig.borderRadius
};

const customizedReducer = (state = initialState, action) => {
    switch(action.type) {
        default:
            return state
    }
};

export default customizedReducer