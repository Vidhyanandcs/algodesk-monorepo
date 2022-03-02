import './Home.scss';
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadPools} from "../../redux/actions/pools";
import {RootState} from "../../redux/store";
import {Button, Grid, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {microalgosToAlgos} from "algosdk";
import ReactPlayer from 'react-player';
import explainer from '../../assets/images/explainer.m4v';
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';
import {F_DB_POOL} from "@fundstack/sdk";
import fSdk from "../../utils/fSdk";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


function Home(): JSX.Element {

    const pools = useSelector((state: RootState) => state.pools);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        dispatch(loadPools());
    }, [dispatch]);

    const activeList = pools.list.filter((pool) => {
        return pool.active;
    });

    const closedList = pools.list.filter((pool) => {
        return !pool.active;
    });

    function renderPool(pool: F_DB_POOL) {
        return (<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={pool._id}>
            <div className="pool">

                <img src={fSdk.fs.getIpfsLink(pool.logo)} alt="pool-logo" className="logo"/>

                <div className="pool-name">
                    <div>{pool.name}</div>

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
                            Total allocation
                        </div>
                        <div>
                            {pool.total_allocation} ${pool.asset_unit}
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
                </div>
            </div>
        </Grid>);
    }

  return (
      <div className="home-wrapper">
          <div className="home-container">
              <div className="banner-wrapper">
                  <div className="banner-container">
                      <div className={"headline"}>

                          <ReactPlayer url={explainer} playing={true} muted={true} width={"100%"} height="auto" loop={false}/>

                      </div>
                  </div>
              </div>
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1} className={classes.primaryText}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      <div className="pools">
                          <div className="pools-header">
                              <div className="list-title">
                                  Active pools
                              </div>
                              <div className="header-actions">

                              </div>
                          </div>

                          {!pools.loading && activeList.length === 0 ? <div className="empty-pools">
                              There are no active pools. please check back later
                          </div> : ''}
                          <Grid container spacing={2}>
                              {activeList.map((pool) => {
                                  return renderPool(pool)
                              })}

                          </Grid>

                      </div>

                      <div className="pools">
                          <div className="pools-header">
                              <div className="list-title">
                                  Closed pools
                              </div>
                              <div className="header-actions">

                              </div>
                          </div>

                          {!pools.loading && closedList.length === 0 ? <div className="empty-pools">
                              There are no closed pools. please check back later
                          </div> : ''}
                          <Grid container spacing={2}>
                              {closedList.map((pool) => {
                                  return renderPool(pool)
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

export default Home;
