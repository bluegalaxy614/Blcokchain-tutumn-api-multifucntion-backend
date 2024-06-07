import { useRoutes } from "react-router-dom";
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from "./AuthenticationRoutes";
import config from '../config/themeConfig'

export default function ThemeRoutes() {
    return useRoutes([AuthenticationRoutes, MainRoutes], config.themeConfig.basename);
}