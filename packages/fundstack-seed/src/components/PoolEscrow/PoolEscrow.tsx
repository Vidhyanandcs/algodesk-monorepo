import './PoolEscrow.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React from "react";
import fSdk from "../../utils/fSdk";
import algoLogo from "../../assets/images/algo-logo.png";

function PoolEscrow(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;

  return (
      <div className="pool-escrow-wrapper">
          <div className="pool-escrow-container">
                <div className="tile-name">
                    Pool escrow
                </div>
                <div className="address">
                    <span onClick={() => {
                        fSdk.explorer.openAccount(pool.escrow.address);
                    }}>
                        {pool.escrow.address}
                    </span>
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Amount raised</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">
                          {fSdk.fs.getTotalAmountRaised(pool)}
                          <img src={algoLogo} alt="Algo"/>
                      </div>
                  </div>
                  <div className="items">
                      <div className="item key">Asset ({pool.asset.params.name})</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">{fSdk.fs.algodesk.accountClient.getAssetBalWithTicker(pool.asset, pool.escrow)}</div>
                  </div>
              </div>

          </div>
      </div>
  );
}

export default PoolEscrow;
