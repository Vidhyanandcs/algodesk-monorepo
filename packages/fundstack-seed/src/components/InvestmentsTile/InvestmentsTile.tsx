import './InvestmentsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip, Grid, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {getCommonStyles} from "../../utils/styles";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function InvestmentsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {sale} = status;
    const classes = useStyles();

    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
    }, [dispatch, id, account]);

    return (<div className={"investments-tile-wrapper"}>
        <div className={"investments-tile-container"}>
            <div className="tile">
                {/*<div className="tile-header">*/}
                {/*    <div className="tile-name">*/}
                {/*        Investment*/}
                {/*    </div>*/}
                {/*    {fund.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}*/}
                {/*</div>*/}
                <div className="tile-body">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="count">
                                <div className="count-label">
                                    {fund.globalState[globalStateKeys.no_of_investors] === 1 ? 'Investor' : 'Investors'}
                                </div>
                                <div className="count-number">
                                    <span className={classes.primaryText}>
                                        {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_investors], 0)}
                                    </span>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {sale.completed ? <div className="lock">
                                {/*<div className="locker">*/}
                                {/*    <LockOutlinedIcon className="lock-icon"></LockOutlinedIcon>*/}
                                {/*</div>*/}
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
