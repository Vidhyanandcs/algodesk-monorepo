import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./utils/theme";
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
    <HashRouter>
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Provider>
    </HashRouter>,
  document.getElementById('root')
);
