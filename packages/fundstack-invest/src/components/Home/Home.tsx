import './Home.scss';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadPools} from "../../redux/actions/pools";
import {RootState} from "../../redux/store";
import {Button, ButtonGroup, Grid, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {microalgosToAlgos} from "algosdk";
import ReactPlayer from 'react-player';
import explainer from '../../assets/images/explainer.m4v';
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

interface HomeState{
    status: string
}

const initialState: HomeState = {
    status: "active"
};

function Home(): JSX.Element {

    const pools = useSelector((state: RootState) => state.pools);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [
        { status },
        setState
    ] = useState(initialState);

    useEffect(() => {
        dispatch(loadPools());
    }, [dispatch]);

    const renderedList = pools.list.filter((pool) => {
        if (status === "active") {
            return pool.active;
        }
        if (status === "closed") {
            return !pool.active;
        }
        return true;
    });

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
                                  {status === 'active' ? 'Active pools' : ''}
                                  {status === 'closed' ? 'Closed pools' : ''}
                              </div>

                              <div className="header-actions">
                                  {/*<RadioGroup value={status} row onChange={(event, value) => {*/}
                                  {/*    setState(prevState => ({ ...prevState, status: value }));*/}
                                  {/*}}>*/}
                                  {/*    <FormControlLabel value="all" control={<Radio color={"primary"}/>} label="All" />*/}
                                  {/*    <FormControlLabel value="active" control={<Radio color={"primary"}/>} label="Active" />*/}
                                  {/*    <FormControlLabel value="closed" control={<Radio color={"primary"}/>} label="Closed" />*/}
                                  {/*</RadioGroup>*/}

                                  <ButtonGroup variant="outlined" size="small" color="primary">
                                      {/*<Button variant={status === "all" ? 'contained' : 'outlined'} onClick={() => {*/}
                                      {/*    setState(prevState => ({ ...prevState, status: "all" }));*/}
                                      {/*}}>View all</Button>*/}
                                      <Button variant={status === "active" ? 'contained' : 'outlined'} onClick={() => {
                                          setState(prevState => ({ ...prevState, status: "active" }));
                                      }}>Active</Button>
                                      <Button variant={status === "closed" ? 'contained' : 'outlined'} onClick={() => {
                                          setState(prevState => ({ ...prevState, status: "closed" }));
                                      }}>Closed</Button>
                                  </ButtonGroup>

                              </div>
                          </div>

                          {!pools.loading && renderedList.length === 0 ? <div className="empty-pools">
                              <Alert icon={false} style={{borderRadius: 10}}>
                                  {status === 'active' ? 'No active pools' : ''}
                                  {status === 'closed' ? 'No closed pools' : ''}
                              </Alert>
                          </div> : ''}
                          <Grid container spacing={2}>
                              {renderedList.map((pool) => {
                                  return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={pool._id}>
                                      <div className="pool">
                                          <div className="pool-name">
                                              {pool.name}
                                          </div>
                                          <div className="pool-id">
                                              ID: {pool.app_id}
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

export default Home;
