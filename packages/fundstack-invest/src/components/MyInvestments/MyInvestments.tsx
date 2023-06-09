import './MyInvestments.scss';
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadPools} from "../../redux/actions/pools";
import {RootState} from "../../redux/store";
import {Button, Grid, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {microalgosToAlgos} from "algosdk";
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';
import fSdk from "../../utils/fSdk";
import {setVisitedTab} from "../../redux/actions/app";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function MyInvestments(): JSX.Element {

    const accountInfo = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const {investments} = accountInfo;
    const {pools} = investments;

    useEffect(() => {
        dispatch(loadPools());
        dispatch(setVisitedTab('my_investments'));
    }, [dispatch]);

  return (
      <div className="my-investments-wrapper">
          <div className="my-investments-container">
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1} className={classes.primaryText}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      <div className="pools">
                          <div className="pools-header">
                              <div className="list-title">
                                  My investments
                              </div>

                              <div className="header-actions">

                              </div>
                          </div>

                          {!accountInfo.loggedIn ? <div className="empty-pools">
                              Connect wallet to view your investments
                          </div> : ''}

                          {accountInfo.loggedIn && !investments.loading && pools.length === 0 ? <div className="empty-pools">
                              You don't have any invested pools
                          </div> : ''}
                          <Grid container spacing={2}>
                              {pools.map((pool) => {
                                  console.log(pool);
                                  return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={pool._id}>
                                      <div className="pool">

                                          {pool.logo ? <img src={fSdk.fs.getIpfsLink(pool.logo)} alt="pool-logo" className="logo"/> : ''}

                                          <div className="pool-name">
                                              {pool.name}

                                              <div className="pool-id">
                                                  ID: {pool.app_id}
                                              </div>
                                          </div>

                                          <div className="pool-status">
                                              <Button variant={"contained"}
                                                      color={"primary"}
                                                      size={"small"}
                                                      onClick={() => {
                                                          history.push('/portal/pool/' + pool.app_id);
                                                      }}
                                              >View</Button>
                                          </div>

                                          <div className="footer">
                                              <div className="detail">
                                                  <div>
                                                      Registered
                                                  </div>
                                                  <div>
                                                      {pool.localState.registered ? 'Yes' : 'No'}
                                                  </div>
                                              </div>
                                              <div className="detail">
                                                  <div>
                                                      Invested
                                                  </div>
                                                  <div>
                                                      {pool.localState.invested ? 'Yes' : 'No'}
                                                  </div>
                                              </div>
                                              <div className="detail">
                                                  <div>
                                                      Price
                                                  </div>
                                                  <div>
                                                      {microalgosToAlgos(pool.price)}
                                                      <img src={algoLogo} alt="Algo"/>
                                                  </div>
                                              </div>
                                              <div className="detail">
                                                  <div>
                                                      Invested amount
                                                  </div>
                                                  <div>
                                                      {microalgosToAlgos(pool.localState.investedAmount)}
                                                      <img src={algoLogo} alt="Algo"/>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </Grid>
                              })}

                          </Grid>

                      </div>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
              </Grid>


          </div>
      </div>
  );
}

export default MyInvestments;
