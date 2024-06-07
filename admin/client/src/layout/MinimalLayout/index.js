import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MinimalLayout = () => {
    const isAuth = useSelector((state) => state.userAuth.isAuth);

    useEffect(() => {
        if(isAuth) {
            window.location.assign("/dashboard");
        }
        // eslint-disable-next-line
    }, [isAuth]);

    return (
        <Outlet />
    );
};

export default MinimalLayout;
