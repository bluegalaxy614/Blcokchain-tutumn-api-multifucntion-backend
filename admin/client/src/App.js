import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import themes from './themes/index';
import AdminRoutes from './routes/admin';
import { LoadingProvider } from "layout/Context/loading";
import Contextloading from "ui-component/loading";
import GameSocketManager from "./utils/GameSocketManager";
import 'assets/scss/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

const App = () => {
	const customization = useSelector((state) => state.customization);

	useEffect(() => {
		return () => {
			GameSocketManager.getInstance().disconnect();
		}
	}, []);

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={themes(customization)}>
				<CssBaseline />
				<LoadingProvider>
					<Contextloading />
					<AdminRoutes />
				</LoadingProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

export default App;
