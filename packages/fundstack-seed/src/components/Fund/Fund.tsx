import './Fund.scss';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {loadFund, setAction} from "../../redux/actions/fund";
import {Alert} from "@material-ui/lab";
import {Button, Grid, Link, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import loadingLogo from '../../assets/images/logo-loading.gif';
import {getCommonStyles} from "../../utils/styles";
import fundstackSdk from "../../utils/fundstackSdk";
import FundStatus from "../FundStatus/FundStatus";
import FundEscrow from "../FundEscrow/FundEscrow";
import AssetDetailsTile from "../AssetDetailsTile/AssetDetailsTile";
import MyFundActivity from "../MyFundActivity/MyFundActivity";
import FundTimeline from "../FundTimeline/FundTimeline";
import {ArrowBack} from "@material-ui/icons";
import FundStrip from "../FundStrip/FundStrip";
import PublishFund from "../PublishFund/PublishFund";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function Fund(): JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const classes = useStyles();

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadFund(id));
    }, [dispatch, id]);

  return (
      <div className="fund-wrapper">
          <div className="fund-container">

              {fundDetails.loading ? <div className="loading-fund">
                  <img src={loadingLogo} alt="loading ..."></img>
                  <div className="text">loading ...</div>
              </div> : <div>



                  {fund ? <div>
                      {!fund.valid ? <div>
                          <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                              Invalid fund
                          </Alert>
                      </div> : ''}
                      {fund.valid ? <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="fund-header">
                                  <section>
                                      <div className={classes.primaryText + " fund-name"}>
                                          <Link underline="hover" color="inherit" href="#/portal/dashboard/funds/home">
                                              <ArrowBack fontSize={"medium"}></ArrowBack>
                                          </Link>

                                          {fund.globalState[globalStateKeys.name]}
                                      </div>
                                      <div className={"fund-id"} onClick={() => {
                                          fundstackSdk.explorer.openApplication(fund.id);
                                        }
                                      }>
                                          ID: {fund.id}
                                      </div>
                                  </section>
                                  <section style={{marginRight: 50}}>
                                      {!fund.globalState[globalStateKeys.published] ? <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                                dispatch(setAction('publish'));
                                          }}
                                      >Publish</Button> : ''}

                                  </section>

                              </div>

                              <div className="fund-body">
                                  <div className="fund-alert">
                                      {!fund.status.published && fund.status.registration.pending ? <div>
                                          <Alert severity={"warning"} style={{borderRadius: 10}}>Please publish before registration is started.</Alert>
                                      </div> : ''}
                                      {!fund.status.published && !fund.status.registration.pending ? <div>
                                          <Alert severity={"error"} style={{borderRadius: 10}}>Fund not published before registration started. We cannot proceed further.</Alert>
                                      </div> : ''}
                                  </div>
                                  <FundStrip></FundStrip>
                                  <div style={{marginTop: 20}}>
                                      <Grid container spacing={2}>
                                          <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                              <Grid container spacing={2}>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <FundStatus></FundStatus>
                                                  </Grid>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <FundEscrow></FundEscrow>
                                                  </Grid>
                                                  <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                                      <AssetDetailsTile></AssetDetailsTile>
                                                  </Grid>
                                                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                      <MyFundActivity></MyFundActivity>
                                                  </Grid>
                                              </Grid>
                                          </Grid>
                                          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                            <FundTimeline></FundTimeline>
                                          </Grid>
                                      </Grid>
                                  </div>
                              </div>

                          </Grid>
                      </Grid> : ''}
                  </div> : ''}

              </div>}

            <PublishFund></PublishFund>
          </div>
      </div>
  );
}

export default Fund;
