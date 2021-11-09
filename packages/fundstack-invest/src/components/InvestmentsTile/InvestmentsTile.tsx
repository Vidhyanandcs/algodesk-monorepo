import './InvestmentsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";


function InvestmentsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;

    return (<div className={"investments-tile-wrapper"}>
        <div className={"investments-tile-container"}>
            <div className="tile">
                <div className="tile-header">
                    <div className="tile-name">
                        Investments
                    </div>
                    {fund.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                    {fund.status.sale.completed ? <Chip label={"Completed"} size={"small"} className="tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="count">Total investors : <span>{fund.globalState[globalStateKeys.no_of_investors]}</span></div>
                </div>
            </div>
        </div>
    </div>);
}

export default InvestmentsTile;
