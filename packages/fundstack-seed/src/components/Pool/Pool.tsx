import './Pool.scss';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {loadPool, setAction} from "../../redux/actions/pool";
import {Alert} from "@material-ui/lab";
import {Button, Grid, Link, Tooltip} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import loadingLogo from '../../assets/images/logo-loading.gif';
import fSdk from "../../utils/fSdk";
import PoolStatus from "../PoolStatus/PoolStatus";
import PoolEscrow from "../PoolEscrow/PoolEscrow";
import AssetDetailsTile from "../AssetDetailsTile/AssetDetailsTile";
import MyPoolActivity from "../MyPoolActivity/MyPoolActivity";
import PoolTimeline from "../PoolTimeline/PoolTimeline";
import {ArrowBack, CachedRounded, Launch} from "@material-ui/icons";
import PoolStrip from "../PoolStrip/PoolStrip";
import PublishPool from "../PublishPool/PublishPool";
import WithdrawAssets from "../WithdrawAssets/WithdrawAssets";
import ClaimAmount from "../ClaimAmount/ClaimAmount";
import {REACT_APP_INVESTOR_PORTAL} from "../../env";
import DeletePool from "../DeletePool/DeletePool";


function Pool(): JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadPool(id));
    }, [dispatch, id]);

  return (
      <div className="pool-wrapper">
          <div className="pool-container">

              {poolDetails.loading ? <div className="loading-pool">
                  <img src={loadingLogo} alt="loading ..."></img>
                  <div className="text">loading ...</div>
              </div> : <div>



                  {pool ? <div>
                      {!pool.valid ? <div>
                          <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                              Invalid pool
                          </Alert>
                      </div> : ''}
                      {pool.valid ? <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="pool-header">
                                  <section>
                                      <div className={"pool-name"}>
                                          <Link underline="hover" href="#/portal/dashboard/pools/home">
                                              <ArrowBack fontSize={"medium"}></ArrowBack>
                                          </Link>

                                          <img src={fSdk.fs.getIpfsLink(pool.globalState[globalStateKeys.logo])} alt="pool-logo"/>

                                          <div style={{display: 'inline-block'}}>
                                              <div>{pool.globalState[globalStateKeys.name]}</div>
                                              <div>
                                                  <div className={"pool-id"} onClick={() => {
                                                      fSdk.explorer.openApplication(pool.id);
                                                  }
                                                  }>
                                                      ID: {pool.id}
                                                  </div>


                                                  <Tooltip title="Refresh">
                                                      <div className="reload" onClick={() => {
                                                          dispatch(loadPool(id));
                                                      }}>
                                                          <CachedRounded fontSize={"small"}></CachedRounded>
                                                      </div>
                                                  </Tooltip>

                                                  {pool.status.published ? <Tooltip title="Open in investor portal">
                                                      <div className="open" onClick={() => {
                                                          window.open(REACT_APP_INVESTOR_PORTAL + '/#/portal/pool/' + pool.id, '_blank');
                                                      }}>
                                                          <Launch fontSize={"small"}></Launch>
                                                      </div>
                                                  </Tooltip> : ''}

                                              </div>
                                          </div>



                                      </div>


                                  </section>
                                  <section style={{marginRight: 50}}>

                                      {!pool.globalState[globalStateKeys.published] ? <Button
                                          color={"secondary"}
                                          variant={"outlined"}
                                          size={"large"}
                                          className="custom-button"
                                          style={{marginRight: 15}}
                                          onClick={() => {
                                              dispatch(setAction('delete'));
                                          }}
                                      >Delete</Button> : ''}

                                      {!pool.globalState[globalStateKeys.published] ? <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                                dispatch(setAction('publish'));
                                          }}
                                      >Publish</Button> : ''}

                                      {pool.status.sale.completed && !pool.globalState[globalStateKeys.target_reached] && !pool.globalState[globalStateKeys.assets_withdrawn]? <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                              dispatch(setAction('withdraw'));
                                          }}
                                      >Withdraw</Button> : ''}

                                      {pool.status.sale.completed && pool.globalState[globalStateKeys.target_reached] && !pool.globalState[globalStateKeys.amount_claimed]? <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {
                                              dispatch(setAction('claim'));
                                          }}
                                      >Claim amount</Button> : ''}

                                  </section>

                              </div>

                              <div className="pool-body">
                                  <div className="pool-alert">
                                      {!pool.status.published && pool.status.registration.pending ? <div>
                                          <Alert severity={"warning"} style={{borderRadius: 10}}>Please publish before registration is started.</Alert>
                                      </div> : ''}
                                      {!pool.status.published && !pool.status.registration.pending ? <div>
                                          <Alert severity={"error"} style={{borderRadius: 10}}>Pool not published before registration started. We cannot proceed further.</Alert>
                                      </div> : ''}

                                      <div style={{marginTop: 10}}>
                                          {pool.status.registration.pending ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Registration starts in {pool.status.registration.durationReadable}</Alert>
                                          </div> : ''}
                                          {pool.status.published && pool.status.registration.active ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Registration ends in {pool.status.registration.durationReadable}</Alert>
                                          </div> : ''}


                                          {pool.status.published && pool.status.registration.completed && pool.status.sale.pending ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Sale starts in {pool.status.sale.durationReadable}</Alert>
                                          </div> : ''}
                                          {pool.status.published && pool.status.registration.completed && pool.status.sale.active ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Sale ends in {pool.status.sale.durationReadable}</Alert>
                                          </div> : ''}

                                          {pool.status.published && pool.status.sale.completed && pool.status.targetReached && pool.status.claim.pending ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Claim starts in {pool.status.claim.durationReadable}</Alert>
                                          </div> : ''}
                                          {pool.status.published && pool.status.sale.completed && pool.status.targetReached && pool.status.claim.active ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Claim ends in {pool.status.claim.durationReadable}</Alert>
                                          </div> : ''}

                                          {pool.status.published && pool.status.sale.completed && !pool.status.targetReached && pool.status.withdraw.pending ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Withdraw starts in {pool.status.withdraw.durationReadable}</Alert>
                                          </div> : ''}
                                          {pool.status.published && pool.status.sale.completed && !pool.status.targetReached && pool.status.withdraw.active ? <div>
                                              <Alert severity={"warning"} style={{borderRadius: 10}}>Withdraw ends in {pool.status.withdraw.durationReadable}</Alert>
                                          </div> : ''}
                                      </div>


                                  </div>
                                  <PoolStrip></PoolStrip>
                                  <div style={{marginTop: 20}}>
                                      <Grid container spacing={2}>
                                          <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                              <Grid container spacing={2}>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <PoolStatus></PoolStatus>
                                                  </Grid>
                                                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                                      <PoolEscrow></PoolEscrow>
                                                  </Grid>
                                                  <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                                                      <AssetDetailsTile></AssetDetailsTile>
                                                  </Grid>
                                                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                      <MyPoolActivity></MyPoolActivity>
                                                  </Grid>
                                              </Grid>
                                          </Grid>
                                          <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                            <PoolTimeline></PoolTimeline>
                                          </Grid>
                                      </Grid>
                                  </div>
                              </div>

                          </Grid>
                      </Grid> : ''}
                  </div> : ''}

              </div>}

            <PublishPool></PublishPool>
            <WithdrawAssets></WithdrawAssets>
            <ClaimAmount></ClaimAmount>
            <DeletePool></DeletePool>
          </div>
      </div>
  );
}

export default Pool;
