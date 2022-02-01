import './FundEscrow.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@fundstack/sdk";
import {Chip, LinearProgress, withStyles} from "@material-ui/core";
import React from "react";
import {formatNumWithDecimals} from "@algodesk/core";
import {CheckCircle, Cancel} from "@material-ui/icons";
import fundstackSdk from "../../utils/fundstackSdk";
import algoLogo from "../../assets/images/algo-logo.png";
import {microalgosToAlgos} from "algosdk";


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


function FundEscrow(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {status} = fund;


    const totalAllocation = fund.globalState[globalStateKeys.total_allocation] / Math.pow(10, fund.asset.params.decimals);
    const remainingAllocation = fund.globalState[globalStateKeys.remaining_allocation] / Math.pow(10, fund.asset.params.decimals);
    const soldAllocation = totalAllocation - remainingAllocation;



  return (
      <div className="fund-escrow-wrapper">
          <div className="fund-escrow-container">
                <div className="tile-name">
                    Fund escrow
                </div>
                <div className="address">
                    <span onClick={() => {
                        console.log(fund.escrow);
                        fundstackSdk.explorer.openAccount(fund.escrow.address);
                    }}>
                        {fund.escrow.address}
                    </span>
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Algos</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{microalgosToAlgos(fundstackSdk.fundstack.algodesk.accountClient.getBalance(fund.escrow))}
                          <img src={algoLogo} alt="Algo"/>
                      </div>
                  </div>
                  <div className="items">
                      <div className="item key">Asset ({fund.asset.params.name})</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{fundstackSdk.fundstack.algodesk.accountClient.getAssetBalWithTicker(fund.asset, fund.escrow)}</div>
                  </div>
              </div>

          </div>
      </div>
  );
}

export default FundEscrow;
