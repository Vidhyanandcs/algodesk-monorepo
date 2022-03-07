import './Pool.scss';
import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadPool} from "../../redux/actions/pool";
import {RootState} from "../../redux/store";
import {Grid, Link, Tooltip} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {ellipseAddress} from "@algodesk/core";
import PoolStatus from "../PoolStatus/PoolStatus";
import CompanyDetails from "../CompanyDetails/CompanyDetails";
import AssetDetailsTile from "../AssetDetailsTile/AssetDetailsTile";
import fSdk from "../../utils/fSdk";
import RegistrationTile from "../RegistrationTile/RegistrationTile";
import InvestmentsTile from "../InvestmentsTile/InvestmentsTile";
import ClaimsTile from "../ClaimsTile/ClaimsTile";
import {ArrowBack, CachedRounded} from "@material-ui/icons";
import WithdrawTile from "../WithdrawTile/WithdrawTile";
import MyPoolActivity from "../MyPoolActivity/MyPoolActivity";
import {Alert} from "@material-ui/lab";
import loadingLogo from '../../assets/images/logo-loading.gif';


function Pool(): JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const poolDetails = useSelector((state: RootState) => state.pool);
    const app = useSelector((state: RootState) => state.app);
    const {pool} = poolDetails;
    const history = useHistory();

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadPool(id));
    }, [dispatch, id]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            </Grid>
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                <div className={"pool-wrapper"}>
                    <div className={"pool-container"}>
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
                                {pool.valid && !pool.status.published? <div>
                                    <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                                        Pool not published
                                    </Alert>
                                </div> : ''}
                                {pool.valid && pool.status.published ? <Grid container spacing={2}>
                                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                                        <div className="pool-header">

                                            <div className="pool-name">
                                                <Link underline="hover" color="inherit"  onClick={() => {
                                                        const {visitedTab} = app;
                                                        let url = '/portal/pools';
                                                        if (visitedTab === 'my_investments') {
                                                            url = '/portal/investments';
                                                        }
                                                        history.push(url);
                                                    }
                                                }>
                                                    <ArrowBack fontSize={"medium"}></ArrowBack>
                                                </Link>
                                                {pool.globalState[globalStateKeys.logo] ? <img src={fSdk.fs.getIpfsLink(pool.globalState[globalStateKeys.logo])} alt="pool-logo" className="logo"/> : ''}


                                                <div style={{display: 'inline-block'}}>
                                                    <div>
                                                        {pool.globalState[globalStateKeys.name]}
                                                    </div>
                                                    <div>
                                                        <div className="items">
                                                            <div className="item">
                                                                <div className="pool-id" onClick={() => {
                                                                    fSdk.explorer.openApplication(pool.id);
                                                                }}>
                                                                    ID: {pool.id}
                                                                </div>
                                                                <Tooltip title="Refresh">
                                                                    <div className="reload" onClick={() => {
                                                                        dispatch(loadPool(id));
                                                                    }}>
                                                                        <CachedRounded style={{color: '#666'}}></CachedRounded>
                                                                    </div>
                                                                </Tooltip>

                                                            </div>
                                                            <div className="item">
                                                                <div className="pool-owner" onClick={() => {
                                                                    fSdk.explorer.openAccount(pool.globalState[globalStateKeys.owner]);
                                                                }}>
                                                                    <span>Owner: </span> {ellipseAddress(pool.globalState[globalStateKeys.owner], 10)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>




                                            </div>

                                        </div>
                                        <div className="pool-body-tiles">
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                    <RegistrationTile></RegistrationTile>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                    <InvestmentsTile></InvestmentsTile>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                                    {pool.status.sale.completed && !pool.status.targetReached ?  <WithdrawTile></WithdrawTile> : <ClaimsTile></ClaimsTile>}
                                                </Grid>
                                                <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                                                    <AssetDetailsTile></AssetDetailsTile>
                                                </Grid>
                                                <Grid item xs={12} sm={5} md={5} lg={5} xl={5}>
                                                    <CompanyDetails></CompanyDetails>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <PoolStatus></PoolStatus>
                                            </Grid>
                                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                <MyPoolActivity></MyPoolActivity>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid> : ''}
                            </div> : ''}

                        </div>}

                    </div>
                </div>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            </Grid>
        </Grid>);
}

export default Pool;
