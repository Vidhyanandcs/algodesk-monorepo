import './Header.scss';
import {Button, Grid, Link, makeStyles, Tooltip} from "@material-ui/core";
import Logo from "../Logo/Logo";
import {showConnectWallet} from "../../redux/actions/connectWallet";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ellipseAddress} from "@algodesk/core";
import React from "react";
import accountImg from '../../assets/images/user-logo-avatar.png';
import {microalgosToAlgos} from "algosdk";
import fSdk from "../../utils/fSdk";
import {logout} from "../../redux/actions/account";
import {PowerSettingsNew} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function Header(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();

    const homeCls = [classes.primaryColorOnHover];
    const invCls = [classes.primaryColorOnHover];

    if (location.pathname === '/portal/home') {
        homeCls.push(classes.primaryText);
        homeCls.push("active");
    }
    else if (location.pathname === '/portal/investments') {
        invCls.push(classes.primaryText);
        invCls.push("active");
    }

    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <div className="items">
                        <div className="item">
                            <div className={"logo"} onClick={() => {
                                history.push('/portal/home');
                                }
                            }>
                                <Logo></Logo>
                            </div>
                        </div>
                        <div className="item">
                            <Link href={"#portal/home"} className={"menu-link " + homeCls.join(" ")} color={"inherit"}>Home</Link>
                            {account.loggedIn ? <Link href={"#portal/investments"} className={"menu-link " + invCls.join(" ")} color={"inherit"}>My investments</Link> : ''}



                            {!account.loggedIn ? <Button variant={"outlined"}
                                                         color={"primary"}
                                                         size={"medium"}
                                                         style={{marginTop: 18}}
                                                         onClick={() => {
                                                             dispatch(showConnectWallet());
                                                         }}
                            >Connect wallet</Button> : <div className="connect-wallet-item">
                                <div className="user">
                                    <img src={accountImg} alt="address" className="avatar"/>
                                    <div className="addr">
                                        <span onClick={() => {
                                            fSdk.explorer.openAccount(account.information.address);
                                        }}>{ellipseAddress(account.information.address, 8)}</span>
                                        <div className="bal">
                                            {microalgosToAlgos(account.information.amount)}
                                            <img src={algoLogo} alt="Algo"/>
                                        </div>
                                    </div>
                                    <Tooltip title="Logout">
                                          <span className="logout" onClick={(ev) => {
                                              dispatch(logout());
                                              if (location.pathname === '/portal/investments') {
                                                  history.push('/portal/home');
                                              }
                                          }}>
                                                  <PowerSettingsNew fontSize={"small"}></PowerSettingsNew>
                                          </span>

                                    </Tooltip>
                                </div>
                            </div>}

                        </div>


                    </div>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;
