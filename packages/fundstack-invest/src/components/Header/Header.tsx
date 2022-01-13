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
import fundstackSdk from "../../utils/fundstackSdk";
import {logout} from "../../redux/actions/account";
import {PowerSettingsNew} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import {getCommonStyles} from "../../utils/styles";
import connectWhiteImg from '../../assets/images/connect-white.png';
import algoLogo from '../../assets/images/algo-logo.png';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function Header(): JSX.Element {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const history = useHistory();
    const classes = useStyles();

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
                            <Link href={"#portal/home"} className={"menu-link " + classes.primaryColorOnHover}>Home</Link>
                            <Link href="https://docs.fundstack.io" className={"menu-link " + classes.primaryColorOnHover} target="_blank">Docs</Link>


                            {!account.loggedIn ? <Button variant={"contained"}
                                                         color={"primary"}
                                                         size={"small"}
                                                         style={{marginTop: 22}}
                                                         startIcon={<img src={connectWhiteImg} alt="connect-wallet" style={{width: 15}}/>}
                                                         onClick={() => {
                                                             dispatch(showConnectWallet());
                                                         }}
                            >Connect wallet</Button> : <div className="connect-wallet-item">
                                <div className="user">
                                    <img src={accountImg} alt="address" className="avatar"/>
                                    <div className="addr">
                                        <span onClick={() => {
                                            fundstackSdk.explorer.openAccount(account.information.address);
                                        }}>{ellipseAddress(account.information.address, 8)}</span>
                                        <div className="bal">
                                            {microalgosToAlgos(account.information.amount)}
                                            <img src={algoLogo} alt="Algo"/>
                                        </div>
                                    </div>
                                    <Tooltip title="Logout">
                                          <span className="logout" onClick={(ev) => {
                                              dispatch(logout());
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
