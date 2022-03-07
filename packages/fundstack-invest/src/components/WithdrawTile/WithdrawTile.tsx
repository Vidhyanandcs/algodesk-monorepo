import './WithdrawTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip, Grid} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {useParams} from "react-router-dom";
import {setWithdraw} from "../../redux/actions/pool";
import {formatNumWithDecimals} from "@algodesk/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";


function WithdrawTile(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const account = useSelector((state: RootState) => state.account);
    const {pool} = poolDetails;
    const {status} = pool;
    const {withdraw, sale} = status;

    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(setWithdraw(id));
    }, [dispatch, id, account]);

    return (<div className={"withdraw-tile-wrapper"}>
        <div className={"withdraw-tile-container"}>
            <div className="tile">
                <div className="tile-header">
                    <div className="tile-name">
                        Withdraw
                    </div>
                    {withdraw.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                    {sale.completed && withdraw.pending ? <Chip label={"Pending"} color={"secondary"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">



                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="count">
                                <div className="count-number">
                                    <span>
                                        {formatNumWithDecimals(pool.globalState[globalStateKeys.no_of_withdrawls], 0)}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {pool.globalState[globalStateKeys.no_of_withdrawls] === 1 ? 'Withdrawl' : 'Withdrawls'}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            {withdraw.completed ? <div className="lock">
                                <div className="locker">
                                    <LockOutlinedIcon className={"lock-icon"}></LockOutlinedIcon>
                                </div>
                                <div className="lock-label">
                                    Closed
                                </div>
                            </div> : ''}

                            {withdraw.pending || withdraw.active ? <div className="count">
                                <div className="count-number date">
                                    <span>
                                        {withdraw.durationReadable}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {withdraw.pending ? 'To start' : 'To end'}
                                </div>
                            </div> : ''}

                        </Grid>
                    </Grid>



                </div>
            </div>
        </div>
    </div>);
}

export default WithdrawTile;
