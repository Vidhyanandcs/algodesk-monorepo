import './PoolStatus.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@fundstack/sdk";
import {Button, Chip, LinearProgress, Tooltip, withStyles} from "@material-ui/core";
import React from "react";
import {showSnack} from "../../redux/actions/snackbar";
import {claimAssets, setAction, withdrawInvestment} from "../../redux/actions/pool";
import RegistrationConfirmation from "../RegistrationConfirmation/RegistrationConfirmation";
import InvestModal from "../InvestModal/InvestModal";
import {showConnectWallet} from "../../redux/actions/connectWallet";
import {formatNumWithDecimals} from "@algodesk/core";
import {CheckCircle, Cancel} from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import fSdk from "../../utils/fSdk";
import algoLogo from '../../assets/images/algo-logo.png';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 20,
        borderRadius: 10,
    },
    colorPrimary: {
        backgroundColor: "#E0D21F",
    },
    bar: {
        borderRadius: 0,
        backgroundColor: '#03B68C',
    },
}))(LinearProgress);


function PoolStatus(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const account = useSelector((state: RootState) => state.account);
    const {pool} = poolDetails;
    const {status} = pool;
    const {registration, sale, claim, withdraw}= status;
    const dispatch = useDispatch();

    const totalAllocation = pool.globalState[globalStateKeys.total_allocation] / Math.pow(10, pool.asset.params.decimals);
    const remainingAllocation = pool.globalState[globalStateKeys.remaining_allocation] / Math.pow(10, pool.asset.params.decimals);
    const soldAllocation = totalAllocation - remainingAllocation;

    const remainingPerc = (remainingAllocation / totalAllocation) * 100;
    const soldPerc = (soldAllocation / totalAllocation) * 100;

  return (
      <div className="pool-status-wrapper">
          <div className="pool-status-container">
                <div className="tile-name">
                    Pool status
                    {status.sale.completed ? <span style={{marginTop: -5}}>
                        {pool.globalState[globalStateKeys.target_reached] ? <Chip label={"Success"} variant={"default"} icon={<CheckCircle></CheckCircle>} color={"primary"} size={"small"}/>: <Tooltip title={"Did not meet the pool success criteria of " + pool.globalState[globalStateKeys.platform_success_criteria_percentage] + "%. This is considered as a failed attempt to raise funds. You can withdraw your invested amount from escrow."}><Chip label={"Failed"} variant={"default"} icon={<Cancel></Cancel>} color={"secondary"} size={"small"}/></Tooltip> }
                    </span> : ''}

                </div>
                <div className="chart">
                    <BorderLinearProgress variant={"determinate"} value={soldPerc}/>
                    <div className="percentages">
                        <div>
                            {parseFloat(soldPerc + '').toFixed(0)}%
                        </div>
                        <div>
                            {parseFloat(remainingPerc + '').toFixed(0)}%
                        </div>
                    </div>
                    {/*<div className="success-criteria" style={{left: fSdk.fs.getSuccessCriteriaPercentage(pool) + "%"}}></div>*/}
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Total</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(totalAllocation, pool.asset.params.decimals)} {pool.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Sold</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(soldAllocation, pool.asset.params.decimals)} {pool.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Remaining</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(remainingAllocation, pool.asset.params.decimals)} {pool.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Raised</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">
                          {fSdk.fs.getTotalAmountRaised(pool)}
                          <img src={algoLogo} alt="Algo" className="algo-logo"/>
                      </div>
                  </div>
              </div>
              <div className="user-actions">
                  {account.loggedIn? <div>
                      {registration.active ?  poolDetails.account.registered ? <div className="account-action-info">
                          <InfoIcon fontSize={"small"}></InfoIcon>
                          <div className="text">You have registered</div>
                      </div> : <Button variant={"contained"}
                                                                                            color={"primary"}
                                                                                            size={"large"}
                                                                                            fullWidth
                                                                                            className="custom-button"
                                                                                            onClick={() => {
                                                                                                if (account.loggedIn) {
                                                                                                    if (poolDetails.account.registered) {
                                                                                                        dispatch(showSnack({severity: 'error', message: 'You have already registered'}));
                                                                                                    }
                                                                                                    else {
                                                                                                        dispatch(setAction("registration_confirmation"));
                                                                                                    }
                                                                                                }
                                                                                                else {
                                                                                                    dispatch(showSnack({severity: 'error', message: 'Please connect your wallet'}));
                                                                                                }
                                                                                            }}
                      >Register</Button> : ''}
                      {sale.active ? <div>
                          {poolDetails.account.registered ? poolDetails.account.invested ?  <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">You have invested</div>
                          </div> : <Button variant={"contained"}
                                                                    color={"primary"}
                                                                    size={"large"}
                                                                    fullWidth
                                                                    className="custom-button"
                                                                    onClick={() => {
                                                                        if (account.loggedIn) {
                                                                            if (poolDetails.account.registered) {
                                                                                if (poolDetails.account.invested) {
                                                                                    dispatch(showSnack({severity: 'error', message: 'You have already invested'}));
                                                                                }
                                                                                else {
                                                                                    dispatch(setAction("invest"));
                                                                                }
                                                                            }
                                                                            else {
                                                                                dispatch(showSnack({severity: 'error', message: 'You have not registered'}));
                                                                            }
                                                                        }
                                                                        else {
                                                                            dispatch(showSnack({severity: 'error', message: 'Please connect your wallet'}));
                                                                        }
                                                                    }}
                          >Invest</Button> : <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">Only registered users can invest</div>
                          </div>}
                      </div> : ''}
                      {claim.active ? <div>
                          {poolDetails.account.invested ? poolDetails.account.claimed ? <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">You have claimed your assets</div>
                          </div> : <Button variant={"contained"}
                                                                  color={"primary"}
                                                                  size={"large"}
                                                                  className="custom-button"
                                                                  fullWidth
                                                                  onClick={() => {
                                                                      if (account.loggedIn) {
                                                                          if (poolDetails.account.invested) {
                                                                              if (poolDetails.account.claimed) {
                                                                                  dispatch(showSnack({severity: 'error', message: 'You have already claimed'}));
                                                                              }
                                                                              else {
                                                                                  dispatch(claimAssets(Number(pool.id)));
                                                                              }
                                                                          }
                                                                          else {
                                                                              dispatch(showSnack({severity: 'error', message: 'You have not invested'}));
                                                                          }
                                                                      }
                                                                      else {
                                                                          dispatch(showSnack({severity: 'error', message: 'Please connect your wallet'}));
                                                                      }
                                                                  }}
                          >Claim assets</Button> : <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">Only invested users can claim the assets</div>
                          </div>}

                      </div> : ''}
                      {withdraw.active ? <div>
                          {poolDetails.account.invested ? poolDetails.account.withdrawn ? <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">You have withdrawn your investment</div>
                          </div> : <Button variant={"contained"}
                                                                  color={"primary"}
                                                                  size={"large"}
                                                                  fullWidth
                                                                  className="custom-button"
                                                                  onClick={() => {
                                                                      if (account.loggedIn) {
                                                                          if (poolDetails.account.invested) {
                                                                              if (poolDetails.account.withdrawn) {
                                                                                  dispatch(showSnack({severity: 'error', message: 'You have already withdrawn'}));
                                                                              }
                                                                              else {
                                                                                  dispatch(withdrawInvestment(Number(pool.id)));
                                                                              }
                                                                          }
                                                                          else {
                                                                              dispatch(showSnack({severity: 'error', message: 'You have not invested'}));
                                                                          }
                                                                      }
                                                                      else {
                                                                          dispatch(showSnack({severity: 'error', message: 'Please connect your wallet'}));
                                                                      }
                                                                  }}
                          >Withdraw investment</Button> : <div className="account-action-info">
                              <InfoIcon fontSize={"small"}></InfoIcon>
                              <div className="text">Only invested users can withdraw</div>
                          </div>}

                      </div> : ''}
                  </div> : <div>
                      <Button variant={"contained"}
                              color={"primary"}
                              size={"large"}
                              fullWidth
                              className="custom-button"
                              onClick={() => {
                                  dispatch(showConnectWallet());
                              }}
                      >Connect wallet</Button>
                      {/*<div className="not-connected-message">Wallet not connected</div>*/}
                  </div>}
              </div>
          </div>
          <RegistrationConfirmation></RegistrationConfirmation>
          <InvestModal></InvestModal>
      </div>
  );
}

export default PoolStatus;
