import './RegistrationTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip} from "@material-ui/core";
import {AccessTime, CheckCircleOutline, EqualizerOutlined} from "@material-ui/icons";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {setRegistration} from "../../redux/actions/fund";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";


function RegistrationTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {registration} = status;
    const {registered} = fundDetails.account;
    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(setRegistration(id));
    }, [dispatch, id, account]);

    return (<div className={"registration-tile-wrapper"}>
        <div className={"registration-tile-container"}>
            <div className="tile">
                <div className="tile-header">
                    <div className="tile-name">
                        Registrations
                    </div>
                    {fund.status.registration.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                    {fund.status.registration.completed ? <Chip label={"Closed"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">
                    <div className="tile-row">
                        <EqualizerOutlined fontSize={"small"} color={"primary"}></EqualizerOutlined>
                        Total registrations : <span>{formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_registrations], 0)}</span>
                    </div>
                    {registered ? <div className="tile-row">
                        <CheckCircleOutline fontSize={"small"} color={"primary"}></CheckCircleOutline>
                        You have registered
                    </div> : ''}
                    {registration.pending || registration.active ? <div className="tile-row">
                        <AccessTime fontSize={"small"} color={"primary"}></AccessTime>
                        {registration.durationReadable}
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>);
}

export default RegistrationTile;
