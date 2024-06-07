import menuItems from "menuitems/admin";
import { makeStyles } from "@mui/styles";
import { DashboardRounded } from "@mui/icons-material";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
    ContentHeaderSection: {
        padding: '15px 15px 0px',
        position: 'relative',
        "& > h1": {
            fontSize: '24px',
            margin: '0px'
        }
    },
    ContentMenu: {
        listStyle: 'none',
        background: 'transparent',
        float: 'right',
        fontSize: '12px',
        marginBottom: '0px',
        marginTop: '0px',
        padding: '7px 5px',
        position: 'absolute',
        right: '10px',
        top: '15px',
        "& > li": {
            display: 'inline-block'
        },
        "& > li > a": {
            color: '#444',
            display: 'inline-block'
        }
    },
    SubMenu: {
        color: '#333',
    }
}))

const ContentHeader = () => {
    const pathName = window.location.pathname;
    const classes = useStyles();
    const selectedMenu = menuItems?.find((item) => { return item.url === pathName });
    const dispatch = useDispatch();

    const handleMenupath = (path) => {
        dispatch({ type: 'SET_MENU_PATH', data: path });
    }

    return (
        <section className={classes.ContentHeaderSection}>
            <h1>{selectedMenu?.headerTitle}</h1>
            <ol className={classes.ContentMenu}>
                <li onClick={() => handleMenupath('/dashboard')}>
                    <Link to='/dashboard'>
                        <DashboardRounded />
                        Home
                    </Link>
                </li>
                <li className={clsx(classes.SubMenu, 'breadCamp')}>
                    {selectedMenu?.text}
                </li>
            </ol>
        </section>
    );
};

export default ContentHeader;