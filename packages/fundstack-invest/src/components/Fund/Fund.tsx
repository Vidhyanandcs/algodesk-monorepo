import './Fund.scss';
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loadFund} from "../../redux/actions/fund";
import {RootState} from "../../redux/store";
import {Chip, Grid} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {ellipseAddress} from "@algodesk/core";
import PieTile from "../PieTile/PieTile";


function Fund(): JSX.Element {
    const params = useParams();
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadFund(id))
    }, [id, dispatch]);

    return (<div className={"fund-wrapper"}>
        <div className={"fund-container"}>
            {fundDetails.loading ? 'loading ...' : <div>
                {fund ? <Grid container spacing={2}>
                    <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                        <div className="fund-header">
                            <div className="fund-name">
                                {fund.globalState[globalStateKeys.name]}
                            </div>
                            <div className="fund-id">
                                ID: {fund.id}
                            </div>
                            <div className="fund-creator">
                                <span>Creator: </span> {ellipseAddress(fund.globalState[globalStateKeys.creator], 10)}
                            </div>
                        </div>
                        <div className="fund-body-tiles">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <div className="tile">
                                        <div className="tile-header">
                                            <div className="tile-name">
                                                Registration
                                            </div>
                                            {fund.status.registration.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                                            {fund.status.registration.completed ? <Chip label={"Completed"} size={"small"} className="tile-status"/> : ''}
                                        </div>
                                        <div className="tile-body">
                                            <div className="count">Total registrations: <span>{fund.globalState[globalStateKeys.no_of_registrations]}</span></div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <div className="tile">
                                        <div className="tile-header">
                                            <div className="tile-name">
                                                Investments
                                            </div>
                                            {fund.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                                            {fund.status.sale.completed ? <Chip label={"Completed"} size={"small"} className="tile-status"/> : ''}
                                        </div>
                                        <div className="tile-body">
                                            <div className="count">Total investors: <span>{fund.globalState[globalStateKeys.no_of_investors]}</span></div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <div className="tile">
                                        <div className="tile-header">
                                            <div className="tile-name">
                                                Claims
                                            </div>
                                            {fund.status.claim.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                                            {fund.status.claim.completed ? <Chip label={"Completed"} size={"small"} className="tile-status"/> : ''}
                                        </div>
                                        <div className="tile-body">
                                            <div className="count">Total claims: <span>{fund.globalState[globalStateKeys.no_of_claims]}</span></div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                        <PieTile></PieTile>
                    </Grid>
                </Grid> : ''}

            </div>}

        </div>
    </div>);
}

export default Fund;
