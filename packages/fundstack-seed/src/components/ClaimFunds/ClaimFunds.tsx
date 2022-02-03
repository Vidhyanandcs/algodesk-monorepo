import './ClaimFunds.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CancelOutlined, CheckCircle} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";
import {claim, publish, setAction} from "../../redux/actions/fund";
import {globalStateKeys} from "@fundstack/sdk";
import {microalgosToAlgos} from "algosdk";
import fundstackSdk from "../../utils/fundstackSdk";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function ClaimFunds(): JSX.Element {

    const dispatch = useDispatch();

    const fundDetails = useSelector((state: RootState) => state.fund);
    const show = fundDetails.action === 'claim';
    const {fund} = fundDetails;
    const classes = useStyles();
    

    return (<div>
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>

                    </div>
                    <IconButton color="primary" onClick={() => {
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="claim-funds-wrapper">
                    <div className="claim-funds-container">
                        <div className="pricing">
                            <header className={classes.primaryText}>Claim funds</header>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {fundstackSdk.fundstack.getTotalFundsRaised(fund)} Algo
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {fund.globalState[globalStateKeys.platform_success_fee]} %
                                </div>
                                <div className="text">
                                    Platform success fee. {fund.globalState[globalStateKeys.platform_success_fee]} % of total funds raised as part of your fundraising is charged by the platform. Charged up on successful fundraising.
                                </div>
                            </div>


                            <div className="item">
                                <Button
                                    fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    size={"large"}
                                    className="custom-button"
                                    onClick={async () => {
                                        dispatch(claim({
                                            fundId: Number(fund.id),
                                            unsoldAssetAction: 'claim'
                                        }));
                                    }}
                                >Agree & claim</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default ClaimFunds;
