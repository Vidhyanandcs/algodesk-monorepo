import './InvestmentsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip} from "@material-ui/core";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {CheckCircleOutline, EqualizerOutlined} from "@material-ui/icons";
import {setInvestment} from "../../redux/actions/fund";
import {useParams} from "react-router-dom";


function InvestmentsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {invested} = fundDetails.account;
    console.log(fundDetails.account);
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
                    {fund.status.sale.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="tile-status"/> : ''}
                    {fund.status.sale.completed ? <Chip label={"Closed"} size={"small"} className="tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="tile-row">
                        <EqualizerOutlined fontSize={"small"} color={"primary"}></EqualizerOutlined>
                        Total investors : <span>{fund.globalState[globalStateKeys.no_of_investors]}</span>
                    </div>
                    {invested ? <div className="tile-row">
                        <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                        You have invested
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>);
}

export default InvestmentsTile;
