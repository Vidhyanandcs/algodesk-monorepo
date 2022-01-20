import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import Assets from "../Assets/Assets";
import React from "react";
import {Button, ButtonGroup} from "@material-ui/core";
import algosdk from "../../utils/algosdk";
import {getNetworks, setLocalNetwork} from "@algodesk/core";
import {setNetwork as selectNetwork} from "../../redux/actions/network";
import {loadAccount} from "../../redux/actions/account";
import {showSnack} from "../../redux/actions/snackbar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";


function Dashboard(): JSX.Element {
    let networks = getNetworks();

    const account = useSelector((state: RootState) => state.account);
    const {address} = account.information;
    const currentNetwork = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();

  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <div className="dashboard-header">
                  <div style={{marginTop: 10}}>
                      My Dashboard
                  </div>
                  <div>
                      <ButtonGroup variant="outlined" size="small" color="primary" style={{marginTop: 2}}>
                          {networks.map((network) => {
                              return (<Button key={network.name} variant={currentNetwork.name === network.name ? 'contained' : 'outlined'} onClick={() => {
                                  const {name} = network;
                                  if (algosdk.signer.isNetworkSupported(name)) {
                                      setLocalNetwork(name);
                                      dispatch(selectNetwork(name));
                                      dispatch(loadAccount(address));
                                  }
                                  else {
                                      dispatch(showSnack({
                                          severity: 'error',
                                          message: 'Network not supported'
                                      }));
                                  }
                              }}>{network.label}</Button>);
                          })}
                      </ButtonGroup>
                  </div>




              </div>
              <Switch>
                  <Route path="/portal/dashboard/assets">
                      <Assets></Assets>
                  </Route>
                  <Route exact path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/assets" />} />
              </Switch>
          </div>
      </div>
  );
}

export default Dashboard;
