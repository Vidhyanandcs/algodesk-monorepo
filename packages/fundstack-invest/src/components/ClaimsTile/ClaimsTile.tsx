import './ClaimsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";


function ClaimsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

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
                    <div className="count">Total claims : <span>{fund.globalState[globalStateKeys.no_of_claims]}</span></div>
                </div>
            </div>
        </div>
    </div>);
}

export default ClaimsTile;
