import './Fund.scss';
import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadFund} from "../../redux/actions/fund";
import {RootState} from "../../redux/store";
import {Grid, Tooltip} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {ellipseAddress} from "@algodesk/core";
import PieTile from "../PieTile/PieTile";
import CompanyDetails from "../CompanyDetails/CompanyDetails";
import AssetDetailsTile from "../AssetDetailsTile/AssetDetailsTile";
import fundstackSdk from "../../utils/fundstackSdk";
import RegistrationTile from "../RegistrationTile/RegistrationTile";
import InvestmentsTile from "../InvestmentsTile/InvestmentsTile";
import ClaimsTile from "../ClaimsTile/ClaimsTile";
import {CachedRounded} from "@material-ui/icons";
import WithdrawTile from "../WithdrawTile/WithdrawTile";
import MyFundActivity from "../MyFundActivity/MyFundActivity";
import {Alert} from "@material-ui/lab";


function Fund(): JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadFund(id));
    }, [dispatch, id]);

    return (<div className={"fund-wrapper"}>
        <div className={"fund-container"}>
            {fundDetails.loading ? 'loading ...' : <div>
                {fund ? <div>
                    {!fund.valid ? <div>
                        <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                            Invalid fund
                        </Alert>
                    </div> : ''}
                    {fund.valid && !fund.status.published? <div>
                        <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                            Fund not published
                        </Alert>
                    </div> : ''}
                    {fund.valid && fund.status.published ? <Grid container spacing={2}>
                        <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                            <div className="fund-header">
                                <div className="fund-name">
                                    {fund.globalState[globalStateKeys.name]}
                                </div>
                                <div className="items">
                                    <div className="item">
                                        <div className="fund-id" onClick={() => {
                                            fundstackSdk.explorer.openApplication(fund.id);
                                        }}>
                                            ID: {fund.id}
                                        </div>
                                        <Tooltip title="Refresh">
                                            <div className="reload" onClick={() => {
                                                dispatch(loadFund(id));
                                            }}>
                                                <CachedRounded style={{color: '#666'}}></CachedRounded>
                                            </div>
                                        </Tooltip>

                                    </div>
                                    <div className="item">
                                        <div className="fund-creator" onClick={() => {
                                            fundstackSdk.explorer.openAccount(fund.globalState[globalStateKeys.creator]);
                                        }}>
                                            <span>Creator: </span> {ellipseAddress(fund.globalState[globalStateKeys.creator], 10)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fund-body-tiles">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                        <RegistrationTile></RegistrationTile>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                        <InvestmentsTile></InvestmentsTile>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                        {fund.status.sale.completed && !fund.status.targetReached ?  <WithdrawTile></WithdrawTile> : <ClaimsTile></ClaimsTile>}
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
                                    <PieTile></PieTile>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <MyFundActivity></MyFundActivity>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> : ''}
                </div> : ''}

            </div>}

        </div>
    </div>);
}

export default Fund;
