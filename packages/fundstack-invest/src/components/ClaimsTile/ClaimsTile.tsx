import './ClaimsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip, Grid, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {useParams} from "react-router-dom";
import {setClaim} from "../../redux/actions/pool";
import {formatNumWithDecimals} from "@algodesk/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {getCommonStyles} from "../../utils/styles";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function ClaimsTile(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const account = useSelector((state: RootState) => state.account);
    const {pool} = poolDetails;
    const {status} = pool;
    const {claim} = status;
    const classes = useStyles();

    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(setClaim(id));
    }, [dispatch, id, account]);

    return (<div className={"claims-tile-wrapper"}>
        <div className={"claims-tile-container"}>
            <div className="tile">
                <div className="tile-header">
                    <div className="tile-name">
                        Claim
                    </div>
                    {claim.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="count">
                                <div className="count-number">
                                    <span>
                                        {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_claims], 0)}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {pool.globalState[globalStateKeys.no_of_claims] === 1 ? 'Claim' : 'Claims'}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            {claim.completed ? <div className="lock">
                                <div className="locker">
                                    <LockOutlinedIcon className={"lock-icon " + classes.secondaryBorder} color={"secondary"}></LockOutlinedIcon>
                                </div>
                                <div className="lock-label">
                                    Closed
                                </div>
                            </div> : ''}

                            {claim.pending || claim.active ? <div className="count">
                                <div className="count-number date">
                                    <span>
                                        {claim.durationReadable}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {claim.pending ? 'To start' : 'To end'}
                                </div>
                            </div> : ''}

                        </Grid>
                    </Grid>

                </div>
            </div>
        </div>
    </div>);
}

export default ClaimsTile;
