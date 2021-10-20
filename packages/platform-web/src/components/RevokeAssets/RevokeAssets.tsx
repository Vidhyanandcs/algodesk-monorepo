import './RevokeAssets.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {Cancel} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import {isNumber} from "../../utils/core";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {A_RevokeAssetParams} from "@algodesk/core";
import {showTransactionDetails} from "../../redux/actions/transaction";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface RevokeAssetState extends A_RevokeAssetParams{
    from: string,
    assetIndex: number,
    revokeTarget: string,
    revokeReceiver: string,
    amount: number
    note: string
}
const initialState: RevokeAssetState = {
    from: "",
    assetIndex: 0,
    revokeTarget: "",
    revokeReceiver: "",
    amount: 0,
    note: ""
};

function RevokeAssets(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'revoke';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {revokeTarget, revokeReceiver, amount, note},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    async function revoke() {
        if (!revokeTarget || !sdk.isValidAddress(revokeTarget)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid revoke target address'
            }));
            return;
        }
        if (!revokeReceiver || !sdk.isValidAddress(revokeReceiver)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid revoke receiver address'
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
            const assetParams: A_RevokeAssetParams = {
                from: information.address,
                assetIndex: selectedAsset.index,
                amount,
                revokeReceiver,
                revokeTarget

            };

            dispatch(showLoader('Revoking ...'));
            const {txId} = await algosdk.algodesk.assetClient.revoke(assetParams, note);
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
                                    <div className="id">
                                        ID: {selectedAsset.index}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    required
                                    value={revokeTarget}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, revokeTarget: ev.target.value}));
                                    }}
                                    className="address-field"
                                    label="Target address" variant="outlined" rows={2} fullWidth multiline/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    required
                                    value={revokeReceiver}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, revokeReceiver: ev.target.value}));
                                    }}
                                    className="address-field"
                                    label="Receiver address" variant="outlined" rows={2} fullWidth multiline/>
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="modal-footer-align">
                                <Button color={"primary"}
                                        style={{marginTop: 15}}
                                        variant={"contained"} size={"large"} onClick={() => {
                                            revoke();
                                }}>Revoke</Button>
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

export default RevokeAssets;
