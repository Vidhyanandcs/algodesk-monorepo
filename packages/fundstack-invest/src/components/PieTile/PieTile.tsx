import './PieTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {ResponsiveContainer, Pie, PieChart, Tooltip, Legend} from "recharts";
import {Button} from "@material-ui/core";
import React from "react";
import {showSnack} from "../../redux/actions/snackbar";
import {setAction} from "../../redux/actions/fund";
import RegistrationConfirmation from "../RegistrationConfirmation/RegistrationConfirmation";
import InvestModal from "../InvestModal/InvestModal";
import {showConnectWallet} from "../../redux/actions/connectWallet";

function PieTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {registration, sale}= status;
    const dispatch = useDispatch();

    const totalAllocation = fund.globalState[globalStateKeys.total_allocation] / Math.pow(10, fund.asset.params.decimals);
    const remainingAllocation = fund.globalState[globalStateKeys.remaining_allocation] / Math.pow(10, fund.asset.params.decimals);
    const soldAllocation = totalAllocation - remainingAllocation;

    const remainingPerc = (remainingAllocation / totalAllocation) * 100;
    const soldPerc = (soldAllocation / totalAllocation) * 100;
    const pieData = [
        { name: 'Sold', value: soldAllocation, fill: "#03B68C" },
        { name: 'Remaining', value: remainingAllocation, fill: "#E0D21F" }
    ];

  return (
      <div className="pie-tile-wrapper">
          <div className="pie-tile-container">
                <div className="tile-name">Fund allocation</div>
                <div className="chart">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData}
                                 dataKey="value"
                                 innerRadius={20}
                                 startAngle={-270}
                                 label></Pie>
                            <Tooltip />
                            <Legend></Legend>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Total</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{totalAllocation} {fund.asset.params["unit-name"]}</div>
                  </div>
                  <div className="items">
                      <div className="item key">Sold</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{soldAllocation} <span className="perc">({parseFloat(soldPerc + '').toFixed(2)}%)</span></div>
                  </div>
                  <div className="items">
                      <div className="item key">Remaining</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{remainingAllocation} <span className="perc">({parseFloat(remainingPerc + '').toFixed(2)}%)</span></div>
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
                  </div> : <div>
                      <Button variant={"contained"}
                              color={"primary"}
                              size={"large"}
                              fullWidth
                              onClick={() => {
                                  dispatch(showConnectWallet());
                              }}
                      >Connect wallet</Button>
                  </div>}
              </div>
          </div>
          <RegistrationConfirmation></RegistrationConfirmation>
          <InvestModal></InvestModal>
      </div>
  );
}

export default PieTile;
