import './OptOut.scss';
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
import {CancelOutlined} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
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


interface OptOutState{
    closeRemainderTo: string,
    note: string
}
const initialState: OptOutState = {
    closeRemainderTo: '',
    note: ''
};

function OptOut(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'opt_out';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {closeRemainderTo, note},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    async function optOut() {
        if (!closeRemainderTo || !sdk.isValidAddress(closeRemainderTo)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid close remainder address'
            }));
            return;
        }

        try {
            dispatch(showLoader('Opting Out ...'));

            const {txId} = await algosdk.algodesk.assetClient.optOut(selectedAsset, account.information, closeRemainderTo, note);
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
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="opt-out-wrapper">
                    <div className="opt-out-container">

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-details">
                                    <div className="name">
                                        {selectedAsset.params.name}
                                    </div>
                                    <div className="bal">
                                        Balance: {algosdk.algodesk.accountClient.getAssetBalWithTicker(selectedAsset, information)}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    required
                                    value={closeRemainderTo}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, closeRemainderTo: ev.target.value}));
                                    }}
                                    className="address-field"
                                    label="Close remainder address" variant="outlined" rows={2} fullWidth multiline/>
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
                                        style={{marginTop: 10}}
                                        variant={"contained"} size={"large"} onClick={() => {
                                    optOut();
                                }}>Opt-Out</Button>
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

export default OptOut;
