import './LeftBar.scss';
import {Redirect} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, Link,
    makeStyles,
    Tooltip
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {ellipseAddress} from "@algodesk/core";
import {microalgosToAlgos} from "algosdk";
import algoLogo from "../../assets/images/algo-logo.png";
import {logout} from "../../redux/actions/account";
import {CancelOutlined, CropFree, FileCopyOutlined, PowerSettingsNew} from "@material-ui/icons";
import copy from "copy-to-clipboard";
import {getCommonStyles} from "../../utils/styles";
import {RootState} from "../../redux/store";
import {showSnack} from "../../redux/actions/snackbar";
import QRCode from "qrcode.react";
import algosdk from "../../utils/algosdk";

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
                      Algodesk
                  </div>

              </div>
              <div className="account">
                  <div className="avatar"></div>

                  <div className="addr">
                        <span onClick={() => {
                            algosdk.explorer.openAccount(account.information.address);
                        }}>{ellipseAddress(account.information.address, 8)}</span>
                  </div>
                  <div className="bal">
                      Balance: {microalgosToAlgos(account.information.amount)}
                      <img src={algoLogo} alt="Algo"/>
                  </div>
                  <div className="bal">
                      Created Assets: {account.information.assets.length}
                  </div>
                  <div className="user-actions">
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
                  </div>
              </div>

              <div className="menu-list">
                  <Link href="https://developer.algorand.org/docs/get-details/asa/" color={"textPrimary"} target={"_blank"}>What is an Asset ?</Link>
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
