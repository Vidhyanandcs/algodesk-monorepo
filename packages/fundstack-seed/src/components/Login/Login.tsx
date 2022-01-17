import './Login.scss';
import {showConnectWallet} from "../../redux/actions/connectWallet";
import React from "react";
import {Button, Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {RootState} from "../../redux/store";
import logo from "../../assets/images/logo.png";


function Login(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);

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
                                    Get investment to your ideas
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
                                  <Button variant={"contained"}
                                          color={"primary"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                              dispatch(showConnectWallet());
                                          }}
                                  >Connect wallet</Button>
                              </div>
                          </div>

                      </Grid>
                  </Grid>
              </div>
          </div>
      );
}

export default Login;
