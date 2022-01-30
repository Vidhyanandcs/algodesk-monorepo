import './Dashboard.scss';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Assets from "../Assets/Assets";
import React, {useState} from "react";
import {Button, ButtonGroup, Tab, Tabs} from "@material-ui/core";
import algosdk from "../../utils/algosdk";
import {A_Asset, getNetworks, setLocalNetwork} from "@algodesk/core";
import {setNetwork as selectNetwork} from "../../redux/actions/network";
import {loadAccount} from "../../redux/actions/account";
import {showSnack} from "../../redux/actions/snackbar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import OptedAssets from "../OptedAssets/OptedAssets";
import SendAssets from "../SendAssets/SendAssets";
import CreateAsset from "../CreateAsset/CreateAsset";
import ModifyAsset from "../ModifyAsset/ModifyAsset";
import DeleteAsset from "../DeleteAsset/DeleteAsset";
import FreezeAccount from "../FreezeAssets/FreezeAccount";
import RevokeAssets from "../RevokeAssets/RevokeAssets";
import BurnSupply from "../BurnSupply/BurnSupply";


interface DashboardState{
    tab: string
}

const initialState: DashboardState = {
    tab: 'created_assets'
};

function Dashboard(): JSX.Element {
    let networks = getNetworks();

    const account = useSelector((state: RootState) => state.account);
    const {address} = account.information;
    const currentNetwork = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();
    const history = useHistory();

    const [
        { tab },
        setState
    ] = useState(initialState);


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

              <div className="dashboard-body">
                  <div className="dashboard-tabs">
                      <Tabs
                          value={tab}
                          onChange={(event, newValue) => {
                              setState(prevState => ({ ...prevState, tab: newValue}));
                              if (newValue === 'created_assets') {
                                  history.push('/portal/dashboard/assets');
                              }
                              else if (newValue === 'opted_assets') {
                                  history.push('/portal/dashboard/opted-assets');
                              }

                          }}
                          textColor="primary"
                          indicatorColor="primary"
                          variant={"standard"}
                      >
                          <Tab value="created_assets" label="Created Assets" />
                          <Tab value="opted_assets" label="Opted Assets" />
                      </Tabs>
                  </div>

                  <Switch>
                      <Route path="/portal/dashboard/assets">
                          <Assets></Assets>
                      </Route>
                      <Route path="/portal/dashboard/opted-assets">
                          <OptedAssets></OptedAssets>
                      </Route>
                      <Route exact path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/opted-assets" />} />
                  </Switch>

              </div>

              <SendAssets></SendAssets>
              <CreateAsset></CreateAsset>
              <ModifyAsset></ModifyAsset>
              <DeleteAsset></DeleteAsset>
              <FreezeAccount></FreezeAccount>
              <RevokeAssets></RevokeAssets>
              <BurnSupply></BurnSupply>
          </div>
      </div>
  );
}

export default Dashboard;
