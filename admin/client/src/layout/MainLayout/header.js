import { Avatar, Box, Button, Divider, IconButton, MenuItem, Menu } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { MenuRounded } from "@mui/icons-material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    HeaderContainer: {
        maxHeight: '100px',
        position: 'relative',
        width: '100%',
        zIndex: '3',
        "&>a": {
            color: '#FFF'
        }
    },
    LogoButton: {
        backgroundColor: '#367fa9',
        color: '#FFF',
        fontSize: '20px',
        height: '50px',
        padding: '0px 15px',
        width: '230px',
        textAlign: 'center',
        lineHeight: '50px',
        float: 'left',
        transition: 'width .3s ease-in-out'
    },
    NavBox: {
        minHeight: '50px',
        marginLeft: '230px',
        backgroundColor: '#3c8dbc',
        border: 'none',
        padding: '8px 8px',
        transition: 'margin-left .3s ease-in-out'
    },
    MenuButton: {
        padding: '0px',
        color: '#fff',
        textTransform: 'initial'
    },
    PlayerAvatar: {
        width: '20px',
        height: '20px'
    },
    ProfileBox: {
        display: 'flex',
        alignItems: 'center'
    }
}));

const Header = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const menuOption = useSelector((state) => state.menuOption);
    const userAuth = useSelector((state) => state.userAuth);

    const [menuEl, setMenuEl] = useState(null);
    const menuOpen = Boolean(menuEl);

    const handleMenu = (event) => {
        setMenuEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuEl(null);
    };

    const handleMenuCollaps = () => {
        dispatch({ type: 'SET_MENU_COLLAPS', data: !menuOption.menuCollaps });
    };

    const handleChangePass = () => {
        handleCloseMenu();
        dispatch({ type: 'SET_MENU_PATH', data: '/change-password' });
    }

    const handleLogout = () => {
        handleCloseMenu();
        localStorage.clear();
        window.location.reload();
    }

    return (
        <header className={classes.HeaderContainer}>
            <Link to='/' className={!menuOption.menuCollaps ? classes.LogoButton : clsx(classes.LogoButton, 'w50')}>
                <span>{!menuOption.menuCollaps ? 'FoodWarz' : 'FW'}</span>
            </Link>
            <nav className={!menuOption.menuCollaps ? clsx(classes.NavBox, 'navbar') : clsx(classes.NavBox, 'navbar', 'ml-50')}>
                <IconButton className={classes.MenuButton} onClick={handleMenuCollaps}>
                    <MenuRounded />
                </IconButton>
                <Box className={classes.ProfileBox}>
                    <Avatar src={`assets/images/default.png`} className={classes.PlayerAvatar} />
                    <Button
                        id="menu-button"
                        aria-controls={menuOpen ? 'menu-list' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                        onClick={handleMenu}
                        className={classes.MenuButton}
                    >
                        {userAuth?.userData?.username}
                    </Button>
                    <Menu
                        id="menu-list"
                        anchorEl={menuEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'menu-button'
                        }}
                    >
                        <MenuItem><Box onClick={handleChangePass}><Link to='/change-password'>Change Password</Link></Box></MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </nav>
        </header>
    );
};

export default Header;