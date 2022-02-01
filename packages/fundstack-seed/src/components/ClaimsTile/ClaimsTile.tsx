import './ClaimsTile.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {Grid} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import {useParams} from "react-router-dom";
import {formatNumWithDecimals} from "@algodesk/core";


function ClaimsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {fund} = fundDetails;

    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
    }, [dispatch, id, account]);

    return (<div className={"claims-tile-wrapper"}>
        <div className={"claims-tile-container"}>
            <div className="tile">

                <div className="tile-body">

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="count">
                                <div className="count-label">
                                    Claims
                                </div>
                                <div className="count-number">
                                    <span>
                                        {formatNumWithDecimals(fund.globalState[globalStateKeys.no_of_claims], 0)}
                                    </span>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </div>
            </div>
        </div>
    </div>);
}

export default ClaimsTile;
