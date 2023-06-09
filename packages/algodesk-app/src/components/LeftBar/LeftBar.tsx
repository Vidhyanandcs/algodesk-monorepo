import './LeftBar.scss';
import {Redirect} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    makeStyles,
    Tooltip
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {microalgosToAlgos} from "algosdk";
import algoLogo from "../../assets/images/algo-logo.png";
import {logout} from "../../redux/actions/account";
import {
    CancelOutlined,
    CropFree,
    FileCopyOutlined,
    Launch,
    PowerSettingsNew,
    Repeat
} from "@material-ui/icons";
import copy from "copy-to-clipboard";
import {getCommonStyles} from "../../utils/styles";
import {RootState} from "../../redux/store";
import {showSnack} from "../../redux/actions/snackbar";
import QRCode from "qrcode.react";
import algosdk from "../../utils/algosdk";
import newLogo from '../../assets/images/logo-white.png';
import {showConnectWallet} from "../../redux/actions/connectWallet";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

interface LeftBarState{
    showQr: boolean
}

const initialState: LeftBarState = {
    showQr: false
};

function LeftBar(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [
        { showQr },
        setState
    ] = useState(initialState);

    if (!account.loggedIn) {
        return (<Redirect to='/login'></Redirect>);
    }

  return (
      <div className="left-bar-wrapper">
          <div className="left-bar-container">
              <div className="logo">
                  <div className="text">
                      <img src={newLogo} alt="logo"/>
                  </div>

              </div>
              <div className="account">
                  <div className="avatar"></div>

                  <div className={'addr'}>
                        <span onClick={() => {
                            algosdk.explorer.openAccount(account.information.address);
                        }}>{account.information.address}</span>
                  </div>
                  <div className="user-actions">
                      <div className="icons">
                          <Tooltip title="Copy address">
                              <span className={'action ' + classes.primaryColorOnHover + ' ' + classes.primaryBorderOnHover} onClick={(ev) => {
                                  copy(account.information.address, {
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
                          <Tooltip title="Switch wallet">
                              <span className={'action ' + classes.primaryColorOnHover + ' ' + classes.primaryBorderOnHover} onClick={(ev) => {
                                  dispatch(showConnectWallet());
                              }}>
                                      <Repeat fontSize={"small"}></Repeat>
                              </span>
                          </Tooltip>
                      </div>
                      <Button variant={"text"}
                              color={"primary"}
                              size={"small"}
                              startIcon={ <Launch/>}
                              onClick={(ev) => {
                                  algosdk.explorer.openAccount(account.information.address);
                              }}
                      >View in explorer</Button>

                  </div>
                  <div className="bal">
                      Balance: {microalgosToAlgos(algosdk.algodesk.accountClient.getBalance(account.information))}
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
                              <CancelOutlined />
                          </IconButton>
                      </div>
                  </DialogTitle>
                  <DialogContent>
                      <div className="qr-code-wrapper">
                          <div className="qr-code-container">

                              <Grid container spacing={2}>
                                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                      <QRCode value={account.information.address} size={250}/>
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

export default LeftBar;
