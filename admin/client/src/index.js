import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from 'react-toast-notifications';
import { sessionCheck } from "./redux/action/auth/index";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './assets/scss/style.scss';

const renderApp = (PreReloadState) => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <Provider store={configureStore(PreReloadState)}>
            <ToastContainer />
            <BrowserRouter>
                <ToastProvider>
                  <App />
                </ToastProvider>
            </BrowserRouter>
        </Provider>
    );
}

(async () => renderApp(await sessionCheck()))()

serviceWorker.unregister();