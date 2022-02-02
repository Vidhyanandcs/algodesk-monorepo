import './FundStrip.scss';
import {Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {formatNumWithDecimals} from "@algodesk/core";
import {globalStateKeys} from "@fundstack/sdk";
import fundstackSdk from "../../utils/fundstackSdk";
import algoLogo from "../../assets/images/algo-logo.png";

function FundStrip(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

  return (
      <div className="fund-strip-wrapper">
          <div className="fund-strip-container">
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Registrations
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_registrations], 0)}
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Investors
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_investors], 0)}
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      {fund.status.sale.completed && !fund.status.targetReached ?  <div className="tile">
                          <div className="tile-name">
                              Withdrawls
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_withdrawls], 0)}
                          </div>
                      </div> : <div className="tile">
                          <div className="tile-name">
                              Claims
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_claims], 0)}
                          </div>
                      </div>}
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Asset ID
                          </div>
                          <div className="tile-value small">
                              {fund.asset.index}
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Price
                          </div>
                          <div className="tile-value small">
                              {fundstackSdk.fundstack.getPrice(fund)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Funds raised
                          </div>
                          <div className="tile-value small">
                              {fundstackSdk.fundstack.getTotalFundsRaised(fund)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default FundStrip;
