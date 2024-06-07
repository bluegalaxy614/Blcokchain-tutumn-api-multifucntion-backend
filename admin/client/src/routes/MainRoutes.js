import { lazy } from "react";
import Loadable from '../ui-component/Loadable';
import MainLayout from '../layout/MainLayout/index';

const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const PlayerManagement = Loadable(lazy(() => import('views/playerManagement')));
const PlayerDetail = Loadable(lazy(() => import('views/playerManagement/detail')));
const GameManagement = Loadable(lazy(() => import('views/gameManagement')));
const GameDetail = Loadable(lazy(() => import('views/gameManagement/detail')));
const ChangePassword = Loadable(lazy(() => import('views/auth/changePassword')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/change-password',
            element: <ChangePassword />
        },
        {
            path: '/player',
            children: [
                {
                    path: '/player-list',
                    element: <PlayerManagement />
                },
                {
                    path: '/player-detail',
                    element: <PlayerDetail />
                }
            ]
        },
        {
            path: '/game',
            children: [
                {
                    path: '/game-list',
                    element: <GameManagement />
                },
                {
                    path: '/game-detail',
                    element: <GameDetail />
                }
            ]
        }
    ]
};

export default MainRoutes;