import './RegistrationTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Chip, Grid, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {setRegistration} from "../../redux/actions/fund";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";
import {getCommonStyles} from "../../utils/styles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});

function RegistrationTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;
    const {status} = fund;
    const {registration} = status;
    const dispatch = useDispatch();
    const classes = useStyles();

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
                        Registration
                    </div>
                    {registration.active ? <Chip label={"Active"} color={"primary"} size={"small"} className="custom-chip tile-status"/> : ''}
                </div>
                <div className="tile-body">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="count">
                                <div className="count-number">
                                    <span className={classes.primaryText}>
                                        {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_registrations], 0)}
                                    </span>
                                </div>
                                <div className="count-label">
                                    Registrations
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            {registration.completed ? <div className="lock">
                                <div className="locker">
                                    <LockOutlinedIcon className="lock-icon"></LockOutlinedIcon>
                                </div>
                                <div className="lock-label">
                                    Closed
                                </div>
                            </div> : ''}

                            {registration.pending || registration.active ? <div className="count">
                                <div className="count-number date">
                                    <span className={classes.primaryText}>
                                        {registration.durationReadable}
                                    </span>
                                </div>
                                <div className="count-label">
                                    {registration.pending ? 'To start' : 'To end'}
                                </div>
                            </div> : ''}

                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    </div>);
}

export default RegistrationTile;
