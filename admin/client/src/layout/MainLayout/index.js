import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Header from "./header";
import Sidebar from "./Sidebar/Sidebar";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { useEffect } from "react";

const useStyles = makeStyles(() => ({
    MainContainer: {
        marginLeft: '230px',
        backgroundColor: '#ecf0f5',
        minHeight: 'calc(100vh - 50px)',
        transition: 'transform .3s ease-in-out,margin .3s ease-in-out,-webkit-transform .3s ease-in-out'
    },
    ContentBox: {
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: '250px',
        padding: '15px',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
    }
}))

const AdminLayout = () => {
    const classes = useStyles();
    const menuOption = useSelector((state) => state.menuOption);
    const isAuth = useSelector((state) => state.userAuth.isAuth);

    useEffect(() => {
        if (!isAuth) {
            window.location.assign("/")
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Box>
            <CssBaseline />
            <Header />
            <Sidebar />
            <main className={!menuOption.menuCollaps ? classes.MainContainer : clsx(classes.MainContainer, 'ml-50')}>
                <section className={classes.ContentBox}>
                    <Outlet />
                </section>
            </main>
        </Box>
    );
};

export default AdminLayout;