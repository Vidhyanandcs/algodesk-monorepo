import './Header.scss';
import {Button, Grid, Tooltip} from "@material-ui/core";
import Logo from "../Logo/Logo";
import {showConnectWallet} from "../../redux/actions/connectWallet";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ellipseAddress} from "@algodesk/core";
import React from "react";
import accountImg from '../../assets/images/account-icon.png';
import {microalgosToAlgos} from "algosdk";
import fundstackSdk from "../../utils/fundstackSdk";
import {logout} from "../../redux/actions/account";
import {PowerSettingsNew} from "@material-ui/icons";

function Header(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);

    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <div className="items">
                        <div className="item">
                            <div className={"logo "}>
                                <Logo></Logo>
                            </div>
                        </div>
                        {!account.loggedIn ? <div className="item">
                            <Button variant={"outlined"}
                                    color={"primary"}
                                    size={"small"}
                                    style={{marginTop: 12}}
                                    onClick={() => {
                                        dispatch(showConnectWallet());
                                    }}
                            >Connect wallet</Button>
                        </div> : <div className="item">
                            <div className="connect-wallet-item">
                                <div className="user">
                                    <img src={accountImg} alt="address"/>
                                    <div className="addr">
                                        <span onClick={() => {
                                            fundstackSdk.explorer.openAccount(account.information.address);
                                        }}>{ellipseAddress(account.information.address, 8)}</span>
                                        <div className="bal">
                                            {microalgosToAlgos(account.information.amount)} Algos
                                        </div>
                                    </div>
                                    <Tooltip title="Logout">
                                          <span className="logout" onClick={(ev) => {
                                              dispatch(logout());
                                          }}>
                                                  <PowerSettingsNew fontSize={"medium"}></PowerSettingsNew>
                                          </span>

                                    </Tooltip>
                                </div>
                            </div>
                        </div>}

                    </div>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;
