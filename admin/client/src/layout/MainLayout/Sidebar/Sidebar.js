import { makeStyles } from "@mui/styles";
import menuItems from "menuitems/admin";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { useEffect } from "react";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";

const useStyles = makeStyles(() => ({
    MenuContainer: {
        backgroundColor: '#222d32',
        left: '0px',
        minHeight: '100%',
        paddingTop: '50px',
        top: '0px',
        position: 'absolute',
        width: '230px',
        zIndex: '2',
        transition: 'transform .3s ease-in-out,width .3s ease-in-out,-webkit-transform .3s ease-in-out'
    },
    MenuSection: {
        height: 'auto',
        paddingBottom: '10px'
    },
    MenuList: {
        listStyle: 'none',
        margin: '0px',
        padding: '0px',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }
}));

const Sidebar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const menuOption = useSelector((state) => state.menuOption);

    useEffect(() => {
        const path = window.location.pathname;
        dispatch({ type: 'SET_MENU_PATH', data: path });
        // eslint-disable-next-line
    }, []);

    return (
        <aside className={!menuOption.menuCollaps ? classes.MenuContainer : clsx(classes.MenuContainer, 'w50')}>
            <section className={classes.MenuSection}>
                <ul className={classes.MenuList}>
                    {
                        menuItems?.filter(filterItem => filterItem.icon !== null)?.map((item, index) => (
                            !item.child ? (
                                <SidebarItem item={item} key={index} />
                            ) : (
                                <SidebarItemCollapse item={item} key={index} />
                            )
                        ))
                    }
                </ul>
            </section>
        </aside>
    );
};

export default Sidebar;