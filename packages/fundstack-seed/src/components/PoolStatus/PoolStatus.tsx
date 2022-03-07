import './PoolStatus.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {globalStateKeys} from "@fundstack/sdk";
import {Chip, LinearProgress, Tooltip, withStyles} from "@material-ui/core";
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


function PoolStatus(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {status} = pool;


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
                        {pool.globalState[globalStateKeys.target_reached] ? <Chip label={"success"} icon={<CheckCircle></CheckCircle>} color={"primary"} size={"small"}/>: <Tooltip title={"Did not meet the pool success criteria of " + pool.globalState[globalStateKeys.platform_success_criteria_percentage] + "%. This is considered as a failed attempt to raise funds. You can withdraw your assets from escrow."}><Chip label={"failed"} icon={<Cancel></Cancel>} color={"secondary"} size={"small"}/></Tooltip> }
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
              </div>

          </div>
      </div>
  );
}

export default PoolStatus;
