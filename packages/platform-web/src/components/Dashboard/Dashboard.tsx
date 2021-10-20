import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import {Grid, Tooltip} from '@material-ui/core';
import Assets from "../Assets/Assets";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ellipseAddress} from "@algodesk/core";
import sdk from "algosdk";
import {AccountBalanceWallet, FileCopyOutlined, PowerSettingsNew, CropFree} from '@material-ui/icons';
import {openAccountInExplorer} from "../../utils/core";
import copy from "copy-to-clipboard";
import {showSnack} from "../../redux/actions/snackbar";
import {logout} from '../../redux/actions/account';
// import accountIcon from '../../assets/images/account-icon.png';

function Dashboard(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const {address, amount} = account.information;
    const dispatch = useDispatch();

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
                                          {/*<img src={accountIcon} alt="address"/>*/}
                                          {ellipseAddress(address, 12)}
                                      </div>
                                      <Tooltip title="Copy address">
                                          <span className="action" onClick={(ev) => {
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
                                                  <FileCopyOutlined fontSize={"small"} className="copy-icon"></FileCopyOutlined>
                                          </span>
                                      </Tooltip>
                                      <Tooltip title="Show QR code">
                                          <span className="action" onClick={(ev) => {

                                          }}>
                                                  <CropFree fontSize={"small"} className="copy-icon"></CropFree>
                                          </span>
                                      </Tooltip>

                                      <div className="addr-actions">
                                          <span className="addr-action">
                                              <Tooltip title="Logout">
                                                  <PowerSettingsNew color={"primary"} fontSize={"medium"} className="copy-icon" onClick={(ev) => {
                                                      dispatch(logout());
                                                  }}></PowerSettingsNew>
                                            </Tooltip>
                                          </span>

                                      </div>
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
          </div>
      </div>
  );
}

export default Dashboard;
