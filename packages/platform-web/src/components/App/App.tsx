import React from 'react';
import './App.scss';
import AppRouter from './AppRouter';
import AppSnackbar from "./AppSnackbar";
import Settings from '../Settings/Settings';

function App(): JSX.Element {
  return (
      <div className="app-root">
          <AppRouter></AppRouter>
          <AppSnackbar></AppSnackbar>
          <Settings></Settings>
      </div>
  );
}

export default App;
