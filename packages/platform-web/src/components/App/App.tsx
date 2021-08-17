import React from 'react';
import './App.scss';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Snackbar} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {hideSnack} from '../../redux/actions/snackbar';
import {hideSettings} from '../../redux/actions/settings';
import Alert from "@material-ui/lab/Alert";
import {Redirect, Route, Switch} from "react-router-dom";
import Portal from '../Portal/Portal';
import Login from '../Login/Login';
import Settings from '../Settings/Settings';
import {Close} from '@material-ui/icons';
import {commonStyles} from "../../utils/styles";

const useStyles = makeStyles({
    ...commonStyles,
    customDialog: {
        position: "absolute",
        top: 100
    }
});

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

function RenderSnackbar(): JSX.Element {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    const dispatch = useDispatch();

    return (<Snackbar
        open={snackbar.show}
        anchorOrigin={{ vertical: 'top',
            horizontal: 'center' }}
        autoHideDuration={5000} onClose={() => {dispatch(hideSnack())}}>
        <Alert
            icon={false}
            severity={snackbar.severity}
            onClose={() => {dispatch(hideSnack())}}>
            {snackbar.message}
        </Alert>
    </Snackbar>);
}

function RenderSettings(): JSX.Element {
    const settings = useSelector((state: RootState) => state.settings);
    const dispatch = useDispatch();
    const classes = useStyles();

    return (<div>
        {settings.show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={settings.show}
            classes={{
                 paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{paddingTop: 7}}>Settings</div>
                    <IconButton color="default" onClick={() => {
                        dispatch(hideSettings())
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <Settings></Settings>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog> : ''}
    </div>);
}

function App(): JSX.Element {
  return (
      <div className="app-root">
          {renderPortal()}
          {RenderSnackbar()}
          {RenderSettings()}
      </div>
  );
}

export default App;
