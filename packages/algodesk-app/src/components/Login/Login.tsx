import './Login.scss';
import {showConnectWallet} from "../../redux/actions/connectWallet";
import React from "react";
import {Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {RootState} from "../../redux/store";
import logo from "../../assets/images/logo.png";
import {getNetworks, NETWORKS, setLocalNetwork} from "@algodesk/core";
import {setNetwork as selectNetwork} from "../../redux/actions/network";


function Login(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const currentNetwork = useSelector((state: RootState) => state.network);
    let networks = getNetworks();

    networks = networks.filter((network) => {
        return network.name !== NETWORKS.BETANET;
    });

    if (account.loggedIn) {
        return (<Redirect to='/portal'></Redirect>);
    }

      return (
          <div className="login-wrapper">
              <div className="login-container">

                  <Grid container spacing={0}>
                      <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                          <div className="left-container">
                              <div className="login-cover">
                                <div className="text">
                                    Create & Manage your Assets
                                </div>
                              </div>
                          </div>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                          <div className="right-container">
                              <div className="logo">
                                  <img src={logo} alt="logo"/>
                              </div>

                              <div className="user-actions">
                                  <div className="header-text">Select network</div>
                                  <FormControl component="fieldset">
                                      <RadioGroup row={true} value={currentNetwork.name} onChange={(e) => {
                                          const network = e.currentTarget.value;
                                          setLocalNetwork(network);
                                          dispatch(selectNetwork(network));
                                      }}>
                                          {networks.map((network) => {
                                                return <FormControlLabel value={network.name} key={network.name} control={<Radio color={"primary"}/>} label={network.label}/>
                                          })}
                                      </RadioGroup>
                                  </FormControl>

                                  <div>
                                      <Button variant={"contained"}
                                              color={"primary"}
                                              size={"large"}
                                              style={{marginTop: 30}}
                                              onClick={() => {
                                                  dispatch(showConnectWallet());
                                              }}
                                      >Connect wallet</Button>
                                  </div>

                              </div>
                          </div>

                      </Grid>
                  </Grid>
              </div>
          </div>
      );
}

export default Login;
