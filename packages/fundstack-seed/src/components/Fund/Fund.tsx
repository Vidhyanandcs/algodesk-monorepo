import './Fund.scss';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {loadFund, publish} from "../../redux/actions/fund";
import {Alert} from "@material-ui/lab";
import {Breadcrumbs, Button, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import loadingLogo from '../../assets/images/logo-loading.gif';
import {getCommonStyles} from "../../utils/styles";
import fundstackSdk from "../../utils/fundstackSdk";
import RegistrationTile from "../RegistrationTile/RegistrationTile";
import WithdrawTile from "../WithdrawTile/WithdrawTile";
import ClaimsTile from "../ClaimsTile/ClaimsTile";
import InvestmentsTile from "../InvestmentsTile/InvestmentsTile";
import FundStatus from "../FundStatus/FundStatus";
import FundEscrow from "../FundEscrow/FundEscrow";
import AssetDetailsTile from "../AssetDetailsTile/AssetDetailsTile";


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
    const account = useSelector((state: RootState) => state.account);
    const params = useParams();
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const classes = useStyles();

    console.log(fund);
    console.log(account);

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadFund(id));
    }, [dispatch, id]);

  return (
      <div className="fund-wrapper">
          <div className="fund-container">

              <Breadcrumbs className="crumb">
                  <Link underline="hover" color="inherit" href="#/portal/dashboard/funds/home">
                      Home
                  </Link>
                  <Typography color="textPrimary">{fund && fund.id ? fund.id : 'fund'}</Typography>
              </Breadcrumbs>

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
                                          {fund.globalState[globalStateKeys.name]}
                                      </div>
                                      <div className={"fund-id"} onClick={() => {
                                          fundstackSdk.explorer.openApplication(fund.id);
                                      }
                                      }>
                                          ID: {fund.id}
                                      </div>
                                  </section>
                                  <section>
                                      {!fund.globalState[globalStateKeys.published] ? <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                                console.log(fund);
                                                dispatch(publish(Number(fund.id)));
                                          }}
                                      >Publish</Button> : ''}

                                  </section>

                              </div>

                              <div className="fund-body">
                                  <div className="fund-strip">
                                      <Grid container spacing={2}>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                            <RegistrationTile></RegistrationTile>
                                          </Grid>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                            <InvestmentsTile></InvestmentsTile>
                                          </Grid>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                            {fund.status.sale.completed && !fund.status.targetReached ?  <WithdrawTile></WithdrawTile> : <ClaimsTile></ClaimsTile>}
                                          </Grid>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                              <RegistrationTile></RegistrationTile>
                                          </Grid>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                              <RegistrationTile></RegistrationTile>
                                          </Grid>
                                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                              <RegistrationTile></RegistrationTile>
                                          </Grid>
                                      </Grid>
                                  </div>
                                  <div style={{marginTop: 20}}>
                                      <Grid container spacing={2}>
                                          <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                              <Grid container spacing={2}>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <FundEscrow></FundEscrow>
                                                  </Grid>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <FundStatus></FundStatus>
                                                  </Grid>
                                                  <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                                      <AssetDetailsTile></AssetDetailsTile>
                                                  </Grid>
                                              </Grid>
                                          </Grid>
                                          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>

                                          </Grid>
                                      </Grid>
                                  </div>
                              </div>

                          </Grid>
                      </Grid> : ''}
                  </div> : ''}

              </div>}


          </div>
      </div>
  );
}

export default Fund;
