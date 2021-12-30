import './FundStatus.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@fundstack/sdk";
import {Button, Chip, LinearProgress, withStyles} from "@material-ui/core";
import React from "react";
import {showSnack} from "../../redux/actions/snackbar";
import {claimAssets, setAction, withdrawInvestment} from "../../redux/actions/fund";
import RegistrationConfirmation from "../RegistrationConfirmation/RegistrationConfirmation";
import InvestModal from "../InvestModal/InvestModal";
import {showConnectWallet} from "../../redux/actions/connectWallet";
import {formatNumWithDecimals} from "@algodesk/core";
import {CheckCircle, Warning} from "@material-ui/icons";

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


function FundStatus(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {registration, sale, claim, withdraw}= status;
    const dispatch = useDispatch();

    const totalAllocation = fund.globalState[globalStateKeys.total_allocation] / Math.pow(10, fund.asset.params.decimals);
    const remainingAllocation = fund.globalState[globalStateKeys.remaining_allocation] / Math.pow(10, fund.asset.params.decimals);
    const soldAllocation = totalAllocation - remainingAllocation;

    const remainingPerc = (remainingAllocation / totalAllocation) * 100;
    const soldPerc = (soldAllocation / totalAllocation) * 100;

  return (
      <div className="fund-status-wrapper">
          <div className="fund-status-container">
                <div className="tile-name">
                    Fund status
                    {status.sale.completed ? <span style={{marginTop: -5}}>
                        {fund.globalState[globalStateKeys.target_reached] ? <Chip label={"success"} className="no-border-chip" variant={"outlined"} icon={<CheckCircle></CheckCircle>} color={"primary"} size={"small"}/>: <Chip label={"failed"} className="no-border-chip" variant={"outlined"} icon={<Warning></Warning>} color={"secondary"} size={"small"}/> }
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
                    {/*<div className="success-criteria" style={{left: fundstackSdk.fundstack.getSuccessCriteriaPercentage(fund) + "%"}}></div>*/}
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Total</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(totalAllocation, fund.asset.params.decimals)} {fund.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Sold</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(soldAllocation, fund.asset.params.decimals)} {fund.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Remaining</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{formatNumWithDecimals(remainingAllocation, fund.asset.params.decimals)} {fund.asset.params["unit-name"]}</div>
                  </div>
              </div>
              <div className="user-actions">
                  {account.loggedIn? <div>
                      {registration.active ? <Button variant={"contained"}
                                                     color={"primary"}
                                                     size={"large"}
                                                     fullWidth
                                                     onClick={() => {
                                                         if (account.loggedIn) {
                                                             if (fundDetails.account.registered) {
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
                      {sale.active ? <Button variant={"contained"}
                                             color={"primary"}
                                             size={"large"}
                                             fullWidth
                                             onClick={() => {
                                                 if (account.loggedIn) {
                                                     if (fundDetails.account.registered) {
                                                         if (fundDetails.account.invested) {
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
                      >Invest</Button> : ''}
                      {claim.active ? <Button variant={"contained"}
                                             color={"primary"}
                                             size={"large"}
                                             fullWidth
                                             onClick={() => {
                                                 if (account.loggedIn) {
                                                     if (fundDetails.account.invested) {
                                                         if (fundDetails.account.claimed) {
                                                             dispatch(showSnack({severity: 'error', message: 'You have already claimed'}));
                                                         }
                                                         else {
                                                             dispatch(claimAssets(Number(fund.id)));
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
                      >Claim assets</Button> : ''}
                      {withdraw.active ? <Button variant={"contained"}
                                                                      color={"primary"}
                                                                      size={"large"}
                                                                      fullWidth
                                                                      onClick={() => {
                                                                          if (account.loggedIn) {
                                                                              if (fundDetails.account.invested) {
                                                                                  if (fundDetails.account.withdrawn) {
                                                                                      dispatch(showSnack({severity: 'error', message: 'You have already withdrawn'}));
                                                                                  }
                                                                                  else {
                                                                                      dispatch(withdrawInvestment(Number(fund.id)));
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
                      >Withdraw investment</Button> : ''}
                  </div> : <div>
                      <Button variant={"contained"}
                              color={"primary"}
                              size={"large"}
                              fullWidth
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

export default FundStatus;