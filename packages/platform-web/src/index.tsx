import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./utils/theme";

ReactDOM.render(
  <React.StrictMode>
      <MuiThemeProvider theme={theme}>
          <App />
      </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
