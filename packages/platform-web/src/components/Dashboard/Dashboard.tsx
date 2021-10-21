import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    Tooltip
} from '@material-ui/core';
import Assets from "../Assets/Assets";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ellipseAddress} from "@algodesk/core";
import sdk from "algosdk";
import {AccountBalanceWallet, FileCopyOutlined, PowerSettingsNew, CropFree, Cancel} from '@material-ui/icons';
import {openAccountInExplorer} from "../../utils/core";
import copy from "copy-to-clipboard";
import {showSnack} from "../../redux/actions/snackbar";
import {logout} from '../../redux/actions/account';
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";
import QRCode from "qrcode.react";
import accountImg from '../../assets/images/account-icon.png';


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

interface DashboardState{
    showQr: boolean
}

const initialState: DashboardState = {
    showQr: false
};

function Dashboard(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const {address, amount} = account.information;
    const dispatch = useDispatch();
    const classes = useStyles();

    const [
        { showQr },
        setState
    ] = useState(initialState);

  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      <div className={"dashboard-body"}>
                          <Grid container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                  <div className="account-details">
                                      <div className="addr" onClick={() => {
                                          openAccountInExplorer(address);
                                      }}>
                                          <img src={accountImg} alt="address"/>
                                          {ellipseAddress(address, 12)}
                                      </div>
                                      <Tooltip title="Copy address">
                                          <span className={'action ' + classes.primaryColorOnHover + ' ' + classes.primaryBorderOnHover} onClick={(ev) => {
                                                  copy(address, {
                                                      message: 'Press #{key} to copy',
                                                  });
                                                  ev.preventDefault();
                                                  ev.stopPropagation();
                                                  dispatch(showSnack({
                                                      severity: 'success',
                                                      message: 'Address copied'
                                                  }));
                                              }}>
                                                  <FileCopyOutlined fontSize={"small"}></FileCopyOutlined>
                                          </span>
                                      </Tooltip>
                                      <Tooltip title="Show QR code">
                                          <span className={'action ' + classes.primaryColorOnHover + ' ' + classes.primaryBorderOnHover} onClick={(ev) => {
                                              setState(prevState => ({ ...prevState, showQr: true }));
                                          }}>
                                                  <CropFree fontSize={"small"}></CropFree>
                                          </span>
                                      </Tooltip>
                                      <Tooltip title="Logout" style={{float: 'right'}}>
                                          <span className={'action ' + classes.secondaryColorOnHover + ' ' + classes.secondaryBorderOnHover} onClick={(ev) => {
                                              dispatch(logout());
                                          }}>
                                                  <PowerSettingsNew fontSize={"large"}></PowerSettingsNew>
                                          </span>

                                      </Tooltip>

                                      <div className="balance">
                                          <AccountBalanceWallet color={"primary"}></AccountBalanceWallet>
                                          {sdk.microalgosToAlgos(amount)}
                                      </div>
                                  </div>
                              </Grid>
                          </Grid>
                          <Switch>
                              <Route path="/portal/dashboard/assets">
                                  <Assets></Assets>
                              </Route>
                              <Route exact path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/assets" />} />
                          </Switch>
                      </div>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
              </Grid>









              {showQr ? <Dialog
                  fullWidth={true}
                  maxWidth={"xs"}
                  open={showQr}
                  classes={{
                      paper: classes.customDialog
                  }}
              >
                  <DialogTitle >
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                          <div>

                          </div>
                          <IconButton color="primary" onClick={() => {
                              setState(prevState => ({ ...prevState, showQr: false }));
                          }}>
                              <Cancel />
                          </IconButton>
                      </div>
                  </DialogTitle>
                  <DialogContent>
                      <div className="qr-code-wrapper">
                          <div className="qr-code-container">

                              <Grid container spacing={2}>
                                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                      <QRCode value={address} size={250}/>
                                  </Grid>
                              </Grid>
                          </div>
                      </div>
                  </DialogContent>
                  <DialogActions>

                  </DialogActions>
              </Dialog> : ''}
              
              
              
              
              
              
              
              
              
              
          </div>
      </div>
  );
}

export default Dashboard;
