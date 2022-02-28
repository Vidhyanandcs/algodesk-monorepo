import './InvestmentsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip, Grid, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {setInvestment} from "../../redux/actions/pool";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {getCommonStyles} from "../../utils/styles";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function InvestmentsTile(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const account = useSelector((state: RootState) => state.account);
    const {pool} = poolDetails;
    const {status} = pool;
    const {sale, registration} = status;
    const classes = useStyles();

    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(setInvestment(id));
    }, [dispatch, id, account]);

    return (<div className={"investments-tile-wrapper"}>
        <div className={"investments-tile-container"}>
            <div className="tile">
                <div className="tile-header">
                    <div className="tile-name">
                        Investment
                    </div>
                    {pool.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                    {registration.completed && sale.pending ? <Chip label={"Pending"} color={"secondary"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="count">
                                <div className="count-number">
                                    <span>
                                        {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_investors], 0)}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {pool.globalState[globalStateKeys.no_of_investors] === 1 ? 'Investor' : 'Investors'}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            {sale.completed ? <div className="lock">
                                <div className="locker">
                                    <LockOutlinedIcon className={"lock-icon " + classes.secondaryBorder} color={"secondary"}></LockOutlinedIcon>
                                </div>
                                <div className="lock-label">
                                    Closed
                                </div>
                            </div> : ''}

                            {sale.pending || sale.active ? <div className="count">
                                <div className="count-number date">
                                    <span>
                                        {sale.durationReadable}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {sale.pending ? 'To start' : 'To end'}
                                </div>
                            </div> : ''}

                        </Grid>
                    </Grid>

                </div>
            </div>
        </div>
    </div>);
}

export default InvestmentsTile;
