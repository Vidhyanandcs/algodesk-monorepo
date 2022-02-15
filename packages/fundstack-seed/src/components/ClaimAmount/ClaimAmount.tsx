import './ClaimAmount.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel,
    IconButton, makeStyles, Radio, RadioGroup
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CancelOutlined, CheckCircle} from "@material-ui/icons";
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";
import {claim, setAction} from "../../redux/actions/pool";
import {globalStateKeys} from "@fundstack/sdk";
import fSdk from "../../utils/fSdk";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 50
        }
    };
});

interface ClaimAmountState{
    unsoldAssetAction: string
}

const initialState: ClaimAmountState = {
    unsoldAssetAction: "claim"
};

function ClaimAmount(): JSX.Element {

    const dispatch = useDispatch();

    const poolDetails = useSelector((state: RootState) => state.pool);
    const show = poolDetails.action === 'claim';
    const {pool} = poolDetails;

    const [
        { unsoldAssetAction },
        setState
    ] = useState(initialState);

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
                <div className="claim-amount-wrapper">
                    <div className="claim-amount-container">
                        <div className="pricing">
                            <header className={classes.primaryText}>Claim amount</header>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {fSdk.fs.getTotalAmountRaised(pool)} Algo
                                </div>
                                <div className="text">
                                    Total amount raised
                                </div>
                            </div>
                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {pool.globalState[globalStateKeys.platform_success_fee]} %
                                </div>
                                <div className="text">
                                    Platform success fee. {pool.globalState[globalStateKeys.platform_success_fee]} % of total amount raised is charged by the platform. Charged up on successful completion.
                                </div>
                            </div>

                            <div className="item">
                                <div className={classes.primaryText + ' value'}>
                                    <CheckCircle></CheckCircle>
                                    {fSdk.fs.getRemainingAllocationInDecimals(pool)} {pool.asset.params["unit-name"]}
                                </div>
                                <div className="text">
                                    Unsold assets
                                </div>
                            </div>

                            <div className="item">
                                <div style={{marginBottom: 15, fontSize: 15}}>
                                    What do you want to do with unsold assets ?
                                </div>
                                <FormControl component="fieldset">
                                    <RadioGroup row={true} value={unsoldAssetAction} onChange={(e) => {
                                        setState(prevState => ({ ...prevState, unsoldAssetAction: e.currentTarget.value }));
                                    }}>
                                        <FormControlLabel value="claim" control={<Radio color={"primary"}/>} label="Claim back"/>
                                        <FormControlLabel value="donate" control={<Radio color={"primary"}/>} label="Donate to platform"/>
                                        <FormControlLabel value="burn" control={<Radio color={"primary"}/>} label="Burn permanently"/>
                                    </RadioGroup>
                                </FormControl>
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
                                            poolId: Number(pool.id),
                                            unsoldAssetAction: unsoldAssetAction
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

export default ClaimAmount;
