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
import {Cancel} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import {getAssetBal, getAssetBalWithTicker, isNumber} from "../../utils/core";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {showTransactionDetails} from "../../redux/actions/transaction";
import {A_TransferAssetParams} from "@algodesk/core";

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
    amount: number,
    note: string
}
const initialState: SendAssetState = {
    to: '',
    amount: 0,
    note: ''
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
        {to, amount, note},
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

            const params: A_TransferAssetParams = {
                from: information.address,
                to,
                assetId: selectedAsset.index,
                amount
            };

            const {txId} = await algosdk.algodesk.assetClient.transfer(params, note);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showTransactionDetails(txId));
        }
        catch (e: any) {
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
                    <IconButton color="primary" onClick={() => {
                        dispatch(setAction(''));
                        clearState();
                    }}>
                        <Cancel />
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
                                    required
                                    value={to}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, to: ev.target.value}));
                                    }}
                                    className="address-field"
                                    label="To address" variant="outlined" rows={2} fullWidth multiline/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField label="Amount" variant="outlined"
                                           fullWidth
                                           required
                                           value={amount}
                                           type="number"
                                           onChange={(ev) => {
                                               let value: string = "0";
                                               if(ev.target.value) {
                                                   value = parseFloat(ev.target.value).toFixed(selectedAsset.params.decimals);
                                               }
                                               setState(prevState => ({...prevState, amount: parseFloat(value)}));
                                           }}
                                           InputProps={{
                                               endAdornment: <InputAdornment position="end" color="primary"><Button color="primary" onClick={() => {
                                                   const totalBalance = getAssetBal(selectedAsset, information);
                                                   setState(prevState => ({...prevState, amount: totalBalance}));
                                               }
                                               }>Max</Button></InputAdornment>,
                                           }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    value={note}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, note: ev.target.value}));
                                    }}
                                    label="Note" variant="outlined" rows={3} fullWidth multiline/>
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
