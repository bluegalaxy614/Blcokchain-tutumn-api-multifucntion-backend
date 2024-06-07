import { KeyboardArrowRight } from "@mui/icons-material";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import SidebarItem from "./SidebarItem";

const useStyles = makeStyles(() => ({
    MenuItem: {
        margin: '0px',
        padding: '0px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        "&>div": {
            padding: '12px 5px 12px 10px',
            borderLeft: 'solid 3px transparent',
            color: '#b8c7ce',
            display: 'block',
            cursor: 'pointer',
            "&>svg": {
                width: '24px',
                height: '24px'
            },
            "&>span": {
                marginLeft: '5px'
            }
        },
        "&:hover": {
            backgroundColor: '#1e282c',
            color: '#72afd2'
        },
        "&>svg": {
            marginRight: '10px',
            color: '#b8c7ce',
            width: '16px',
            height: '16px'
        }
    },
    ActiveMenu: {
        backgroundColor: '#1e282c !important',
        color: '#FFF !important',
        borderLeftColor: '#3c8dbc !important'
    },
    SubMenuBox: {
        paddingLeft: '10%',
        background: '#1e2426',
        height: '0px',
        transition: 'height .3s ease-in-out',
        overflow: 'hidden'
    },
    ActiveSubMenu: {
        height: (props) => `${props.count * 48}px`
    }
}));

const SidebarItemCollapse = ({ item }) => {
    const classes = useStyles({ count: item.child.length });
    const menuOption = useSelector((state) => state.menuOption);

    const [activeSubMenu, setActiveSubMenu] = useState(false);

    const handleClickMenu = () => {
        setActiveSubMenu(!activeSubMenu);
    };

    return (
        <Box>
            <Box className={classes.MenuItem} onClick={handleClickMenu}>
                <Box>
                    {item.icon}
                    {!menuOption.menuCollaps ? <span>{item.text}</span> : null}
                </Box>
                {!menuOption.menuCollaps ? <KeyboardArrowRight /> : null}
            </Box>
            <Box className={clsx(classes.SubMenuBox, activeSubMenu ? classes.ActiveSubMenu : '')}>
                {
                    item.child.map((route, index) => {
                        return (
                            !route.child ? (
                                <SidebarItem item={route} key={index} />
                            ) : (
                                <SidebarItemCollapse item={route} key={index} />
                            )
                        )
                    })
                }
            </Box>
        </Box>
    );
};

export default SidebarItemCollapse;