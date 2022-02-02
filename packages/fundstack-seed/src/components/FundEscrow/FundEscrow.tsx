import './FundEscrow.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React from "react";
import fundstackSdk from "../../utils/fundstackSdk";
import algoLogo from "../../assets/images/algo-logo.png";

function FundEscrow(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

  return (
      <div className="fund-escrow-wrapper">
          <div className="fund-escrow-container">
                <div className="tile-name">
                    Fund escrow
                </div>
                <div className="address">
                    <span onClick={() => {
                        fundstackSdk.explorer.openAccount(fund.escrow.address);
                    }}>
                        {fund.escrow.address}
                    </span>
                </div>
              <div className="data">
                  <div className="items">
                      <div className="item key">Funds raised</div>
                      <div className="item" style={{textAlign: "center"}}>:</div>
                      <div className="item value">
                          {fundstackSdk.fundstack.getTotalFundsRaised(fund)}
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
