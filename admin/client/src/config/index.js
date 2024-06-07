import baseConfig from './baseConfig';
import ApiConfig from './apiConfig';
import themeConfig from './themeConfig';

const Api = new ApiConfig();

const ConfigData = {
    Api,
    ...baseConfig,
    ...themeConfig
};

export default ConfigData;