import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    MenuItem: {
        margin: '0px',
        padding: '0px',
        position: 'relative',
        "& > a": {
            padding: '12px 5px 12px 10px',
            borderLeft: 'solid 3px transparent',
            color: '#b8c7ce',
            display: 'block',
            "&>svg": {
                width: '24px',
                height: '24px'
            },
            "& > span": {
                marginLeft: '5px'
            },
            "&:hover": {
                backgroundColor: '#1e282c',
                color: '#72afd2'
            }
        }
    },
    ActiveMenu: {
        backgroundColor: '#1e282c !important',
        color: '#FFF !important',
        borderLeftColor: '#3c8dbc !important'
    }
}));

const SidebarItem = ({ item }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const menuOption = useSelector((state) => state.menuOption);

    const handleMenupath = (path) => {
        dispatch({ type: 'SET_MENU_PATH', data: path });
    }

    return (
        <li className={classes.MenuItem} onClick={() => handleMenupath(item.url)}>
            <Link to={item.url} className={menuOption.menuPathName === item.url ? classes.ActiveMenu : ''}>
                {item.icon}
                {!menuOption.menuCollaps ? <span>{item.text}</span> : null}
            </Link>
        </li>
    );
};

export default SidebarItem;