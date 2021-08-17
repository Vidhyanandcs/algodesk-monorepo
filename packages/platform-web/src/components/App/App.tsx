import React from 'react';
import './App.scss';
import {Snackbar} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {hideSnack} from '../../redux/actions/snackbar';
import Alert from "@material-ui/lab/Alert";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Portal from '../Portal/Portal';
import Login from '../Login/Login';

function renderPortal(): JSX.Element {
    return (<div>
        <Switch>
            <Route path="/login">
                <Login></Login>
            </Route>
            <Route path="/portal">
                <Portal></Portal>
            </Route>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    </div>);
}

function App(): JSX.Element {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    const dispatch = useDispatch();

  return (
      <div className="app-root">
          {renderPortal()}
          {/*show alert message*/}
          <Snackbar
              open={snackbar.show}
              anchorOrigin={{ vertical: 'top',
                  horizontal: 'center' }}
              autoHideDuration={5000} onClose={() => {dispatch(hideSnack())}}>
              <Alert
                  severity={snackbar.severity}
                  onClose={() => {dispatch(hideSnack())}}>
                  {snackbar.message}
              </Alert>
          </Snackbar>
      </div>
  );
}

export default App;
