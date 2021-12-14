import './ClaimsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {CheckCircleOutline, EqualizerOutlined} from "@material-ui/icons";
import {useParams} from "react-router-dom";
import {setClaim} from "../../redux/actions/fund";
import {formatNumWithDecimals} from "@algodesk/core";


function ClaimsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {claimed} = fundDetails.account;

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
                        Claims
                    </div>
                    {fund.status.claim.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                    {fund.status.claim.completed ? <Chip label={"Closed"} size={"small"} className="tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="tile-row">
                        <EqualizerOutlined fontSize={"small"} color={"primary"}></EqualizerOutlined>
                        Total claims : <span>{formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_claims], 0)}</span>
                    </div>
                    {claimed ? <div className="tile-row">
                        <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                        You have claimed assets
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>);
}

export default ClaimsTile;
