import './Home.scss';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadFunds} from "../../redux/actions/funds";
import {RootState} from "../../redux/store";
import {Button, FormControlLabel, Grid, makeStyles, Radio, RadioGroup} from "@material-ui/core";
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
    status: "all"
};

function Home(): JSX.Element {

    const funds = useSelector((state: RootState) => state.funds);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const [
        { status },
        setState
    ] = useState(initialState);

    useEffect(() => {
        dispatch(loadFunds());
    }, [dispatch]);

    const renderedList = funds.list.filter((fund) => {
        if (status === "active") {
            return fund.active;
        }
        if (status === "completed") {
            return !fund.active;
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
                      <div className="funds">
                          <div className="funds-header">
                              <div className="list-title">Projects</div>

                              <div className="header-actions">
                                  <RadioGroup value={status} row onChange={(event, value) => {
                                      setState(prevState => ({ ...prevState, status: value }));
                                  }}>
                                      <FormControlLabel value="all" control={<Radio color={"primary"}/>} label="All" />
                                      <FormControlLabel value="active" control={<Radio color={"primary"}/>} label="Active" />
                                      <FormControlLabel value="completed" control={<Radio color={"primary"}/>} label="Completed" />
                                  </RadioGroup>

                                  {/*<ButtonGroup variant="outlined" size="small" color="primary">*/}
                                  {/*    <Button variant={status === "all" ? 'contained' : 'outlined'} onClick={() => {*/}
                                  {/*        setState(prevState => ({ ...prevState, status: "all" }));*/}
                                  {/*    }}>View all</Button>*/}
                                  {/*    <Button variant={status === "active" ? 'contained' : 'outlined'} onClick={() => {*/}
                                  {/*        setState(prevState => ({ ...prevState, status: "active" }));*/}
                                  {/*    }}>Active</Button>*/}
                                  {/*    <Button variant={status === "completed" ? 'contained' : 'outlined'} onClick={() => {*/}
                                  {/*        setState(prevState => ({ ...prevState, status: "completed" }));*/}
                                  {/*    }}>Completed</Button>*/}
                                  {/*</ButtonGroup>*/}

                              </div>
                          </div>

                          {!funds.loading && renderedList.length === 0 ? <div className="empty-funds">
                              <Alert color={"success"} icon={false} style={{borderRadius: 10}}>No projects</Alert>
                          </div> : ''}
                          <Grid container spacing={2}>
                              {renderedList.map((fund) => {
                                  return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={fund._id}>
                                      <div className="fund">
                                          <div className="fund-name">
                                              {fund.name}
                                          </div>
                                          <div className="fund-id">
                                              ID: {fund.app_id}
                                          </div>
                                          <div className="fund-status">
                                              <Button variant={"contained"}
                                                      color={"primary"}
                                                      size={"small"}
                                                      onClick={() => {
                                                          history.push('/portal/fund/' + fund.app_id);
                                                      }}
                                              >View</Button>
                                          </div>

                                          <div className="footer">
                                              <div className="detail">
                                                  <div>
                                                      Total allocation
                                                  </div>
                                                  <div>
                                                      {fund.total_allocation} ${fund.asset_unit}
                                                  </div>
                                              </div>
                                              <div className="detail">
                                                  <div>
                                                      Price
                                                  </div>
                                                  <div>
                                                      {microalgosToAlgos(fund.price)}
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
