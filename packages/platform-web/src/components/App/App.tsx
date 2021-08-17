import React from 'react';
import './App.scss';
import {Button, Snackbar} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {show, hide} from '../../redux/actions/snackbar';
import Alert from "@material-ui/lab/Alert";

function App() {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    console.log(snackbar);
    const dispatch = useDispatch();

  return (
      <div className="app-root">
          <Button color={"primary"} variant={"outlined"} onClick={() => {
              dispatch(show({
                  severity: 'warning',
                  message: 'hello'
              }));
          }}>Save</Button>
          <Button color={"secondary"} onClick={() => {
              dispatch(show({
                  severity: 'info',
                  message: 'welcome'
              }));
          }}>cancel</Button>

          <Snackbar
              open={snackbar.show}
              anchorOrigin={{ vertical: 'top',
                  horizontal: 'center' }}
              autoHideDuration={6000} onClose={() => {hide()}}>
              <Alert
                  severity={snackbar.severity}
                  onClose={() => {hide()}}>
                  {snackbar.message}
              </Alert>
          </Snackbar>


      </div>
  );
}

export default App;
