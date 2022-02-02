import './FundStatus.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@fundstack/sdk";
import {Chip, LinearProgress, withStyles} from "@material-ui/core";
import React from "react";
import {formatNumWithDecimals} from "@algodesk/core";
import {CheckCircle, Cancel} from "@material-ui/icons";


const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 20,
        borderRadius: 10,
    },
    colorPrimary: {
        backgroundColor: 'rgba(218, 240, 227)'
    },
    bar: {
        borderRadius: 0,
        backgroundColor: '#03B68C',
    },
}))(LinearProgress);


function FundStatus(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {status} = fund;


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
                        {fund.globalState[globalStateKeys.target_reached] ? <Chip label={"success"} icon={<CheckCircle></CheckCircle>} color={"primary"} size={"small"}/>: <Chip label={"failed"} icon={<Cancel></Cancel>} color={"secondary"} size={"small"}/> }
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

          </div>
      </div>
  );
}

export default FundStatus;
