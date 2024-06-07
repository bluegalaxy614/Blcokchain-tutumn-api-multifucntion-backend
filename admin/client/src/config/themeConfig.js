const themeConfig = {
    basename: '/',
    defaultPath: '/dashboard',
    fontFamily: `'Jost', 'Roboto', sans-serif`,
    borderRadius: 12
};

const customerModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    width: 500
};

export const gridSpacing = 3;

export default {
    themeConfig,
    customerModalStyle,

    gridSpacing
};