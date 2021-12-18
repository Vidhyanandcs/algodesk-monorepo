import './WithdrawTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {AccessTime, CheckCircleOutline, EqualizerOutlined} from "@material-ui/icons";
import {useParams} from "react-router-dom";
import {setWithdraw} from "../../redux/actions/fund";
import {formatNumWithDecimals} from "@algodesk/core";


function WithdrawTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {withdraw} = status;
    const {withdrawn} = fundDetails.account;

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
                    {fund.status.withdraw.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                    {fund.status.withdraw.completed ? <Chip label={"Closed"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="tile-row">
                        <EqualizerOutlined fontSize={"small"} color={"primary"}></EqualizerOutlined>
                        Total withdraws : <span>{formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_withdrawls], 0)}</span>
                    </div>
                    {withdrawn ? <div className="tile-row">
                        <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                        You have withdrawn
                    </div> : ''}
                    {withdraw.pending || withdraw.active ? <div className="tile-row">
                        <AccessTime fontSize={"small"} color={"primary"}></AccessTime>
                        {withdraw.durationReadable}
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>);
}

export default WithdrawTile;
