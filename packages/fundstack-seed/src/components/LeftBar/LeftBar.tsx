import './LeftBar.scss';
import {Redirect} from "react-router-dom";
import {Button} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@algodesk/app/src/redux/store";
import logo from "../../assets/images/logo-white.png";
import React from "react";
import fundstackSdk from "../../utils/fundstackSdk";
import {ellipseAddress} from "@algodesk/core";
import {microalgosToAlgos} from "algosdk";
import algoLogo from "../../assets/images/algo-logo.png";
import {logout} from "../../redux/actions/account";
import {PowerSettingsNew} from "@material-ui/icons";

function LeftBar(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();

    if (!account.loggedIn) {
        return (<Redirect to='/login'></Redirect>);
    }

  return (
      <div className="left-bar-wrapper">
          <div className="left-bar-container">
              <div className="logo">
                  <img src={logo} alt="logo"/>
              </div>
              <div className="account">
                  <div className="avatar"></div>

                  <div className="addr">
                        <span onClick={() => {
                            fundstackSdk.explorer.openAccount(account.information.address);
                        }}>{ellipseAddress(account.information.address, 8)}</span>
                  </div>
                  <div className="bal">
                      Balance: {microalgosToAlgos(account.information.amount)}
                      <img src={algoLogo} alt="Algo"/>
                  </div>
              </div>
              <div className="footer">
                  <Button variant={"text"}
                          color={"secondary"}
                          size={"large"}
                          fullWidth
                          className="custom-button"
                          startIcon={<PowerSettingsNew></PowerSettingsNew>}
                          onClick={() => {
                              dispatch(logout());
                          }}
                  >Logout</Button>
              </div>
          </div>
      </div>
  );
}

export default LeftBar;
