import './SendAssets.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, InputAdornment, makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {Close} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import {getAssetBal, getAssetBalWithTicker, isNumber} from "../../utils/core";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface SendAssetState{
    to: string,
    amount: number
}
const initialState: SendAssetState = {
    to: '',
    amount: 0
};

function SendAssets(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'send';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {to, amount},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    async function send() {
        if (!to || !sdk.isValidAddress(to)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid to address'
            }));
            return;
        }
        if (amount === undefined || amount === null || !isNumber(amount)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid amount'
            }));
            return;
        }

        try {
            dispatch(showLoader('Sending ...'));
            const {txId} = await algosdk.algodesk.assetClient.transfer(information.address, to, selectedAsset.index, amount);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showSnack({
                severity: 'success',
                message: 'Sent successfully'
            }));
        }
        catch (e) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
    
    return (<div>
        {show && selectedAsset ? <Dialog
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
                    <IconButton color="default" onClick={() => {
                        dispatch(setAction(''));
                        clearState();
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="send-assets-wrapper">
                    <div className="send-assets-container">

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-details">
                                    <div className="name">
                                        {selectedAsset.params.name}
                                    </div>
                                    <div className="bal">
                                        Balance: {getAssetBalWithTicker(selectedAsset, information)}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField 
                                    value={to}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, to: ev.target.value}));
                                    }}
                                    label="To" variant="outlined" rows={3} fullWidth multiline/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField label="Amount" variant="outlined"
                                           fullWidth
                                           value={amount}
                                           onChange={(ev) => {
                                               if (isNumber(ev.target.value)) {
                                                   setState(prevState => ({...prevState, amount: parseInt(ev.target.value)}));
                                               }
                                           }}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end" color="primary"><Button onClick={() => {
                                                   const totalBalance = getAssetBal(selectedAsset, information);
                                                   setState(prevState => ({...prevState, amount: totalBalance}));
                                               }
                                               }>Max</Button></InputAdornment>,
                                           }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button color={"primary"}
                                        style={{marginTop: 15}}
                                        fullWidth variant={"contained"} size={"large"} onClick={() => {
                                            send();
                                }}>Send</Button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default SendAssets;
