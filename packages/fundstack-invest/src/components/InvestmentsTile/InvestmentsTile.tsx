import './InvestmentsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {AccessTime, CheckCircleOutline, EqualizerOutlined, HighlightOffOutlined} from "@material-ui/icons";
import {setInvestment} from "../../redux/actions/fund";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";


function InvestmentsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {sale} = status;
    const {invested} = fundDetails.account;

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
                        Investments
                    </div>
                    {fund.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                    {fund.status.sale.completed ? <Chip label={"Closed"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="tile-row">
                        <EqualizerOutlined fontSize={"small"} color={"primary"}></EqualizerOutlined>
                        Total investors : <span>{formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_investors], 0)}</span>
                    </div>
                    {invested ? <div className="tile-row">
                        <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                        You have invested
                    </div> : ''}
                    {status.sale.completed ? <div>
                        {status.targetReached ? <div className="tile-row">
                            <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                            Success criteria met
                        </div> : <div className="tile-row">
                            <HighlightOffOutlined fontSize={"small"} color={"secondary"}></HighlightOffOutlined>
                            Success criteria failed
                        </div>}
                    </div> :''}
                    {sale.pending || sale.active ? <div className="tile-row">
                        <AccessTime fontSize={"small"} color={"primary"}></AccessTime>
                        {sale.durationReadable}
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>);
}

export default InvestmentsTile;
