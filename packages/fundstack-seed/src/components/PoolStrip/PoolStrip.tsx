import './PoolStrip.scss';
import {Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {formatNumWithDecimals} from "@algodesk/core";
import {globalStateKeys} from "@fundstack/sdk";
import fSdk from "../../utils/fSdk";
import algoLogo from "../../assets/images/algo-logo.png";

function PoolStrip(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;

  return (
      <div className="pool-strip-wrapper">
          <div className="pool-strip-container">
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Registrations
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_registrations], 0)}
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Investors
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_investors], 0)}
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      {pool.status.sale.completed && !pool.status.targetReached ?  <div className="tile">
                          <div className="tile-name">
                              Withdrawls
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_withdrawls], 0)}
                          </div>
                      </div> : <div className="tile">
                          <div className="tile-name">
                              Claims
                          </div>
                          <div className="tile-value">
                              {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_claims], 0)}
                          </div>
                      </div>}
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Price
                          </div>
                          <div className="tile-value small">
                              {fSdk.fs.getPrice(pool)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Amount raised
                          </div>
                          <div className="tile-value small">
                              {fSdk.fs.getTotalAmountRaised(pool)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                      <div className="tile">
                          <div className="tile-name">
                              Asset ID
                          </div>
                          <div className="tile-value small">
                              {pool.asset.index}
                          </div>
                      </div>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default PoolStrip;
