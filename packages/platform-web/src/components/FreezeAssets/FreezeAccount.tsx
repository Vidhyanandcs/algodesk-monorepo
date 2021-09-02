import './FreezeAccount.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, Grid,
    IconButton, makeStyles, RadioGroup, TextField, Radio
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {Close} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {A_FreezeAssetParams} from "@algodesk/core";
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


interface FreezeAssetState extends A_FreezeAssetParams{
    note: string
}
const initialState: FreezeAssetState = {
    assetIndex: 0,
    freezeAccount: "",
    freezeState: true,
    from: "",
    note: ""
};

function FreezeAccount(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'freeze';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {freezeAccount, freezeState, note},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    async function freeze() {
        if (!freezeAccount || !sdk.isValidAddress(freezeAccount)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid address'
            }));
            return;
        }

        try {

            const assetParams: A_FreezeAssetParams = {
                assetIndex: selectedAsset.index,
                freezeAccount: freezeAccount,
                freezeState: freezeState,
                from: information.address,
            };

            console.log(assetParams);
            let message = 'Freezing ...';

            if (!freezeState) {
                message = 'Unfreezing ...';
            }

            dispatch(showLoader(message));
            const {txId} = await algosdk.algodesk.assetClient.freeze(assetParams, note);
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
                    <IconButton color="default" onClick={() => {
                        dispatch(setAction(''));
                        clearState();
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="freeze-account-wrapper">
                    <div className="freeze-account-container">

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
                                <RadioGroup name="status"
                                            style={{justifyContent: "center"}}
                                            row value={freezeState} onChange={(ev) => {
                                    const selection = ev.target.value === "true";
                                    setState(prevState => ({...prevState, freezeState: selection}));
                                }}>
                                    <FormControlLabel value={true} control={<Radio color={"secondary"}/>} label="Freeze" />
                                    <FormControlLabel value={false} control={<Radio color={"primary"}/>} label="Unfreeze" />
                                </RadioGroup>
                            </Grid>


                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    required
                                    value={freezeAccount}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, freezeAccount: ev.target.value}));
                                    }}
                                    className="address-field"
                                    label="Address" variant="outlined" rows={2} fullWidth multiline/>
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
                                <Button color={freezeState ? 'secondary' : 'primary'}
                                        style={{marginTop: 15}}
                                        fullWidth variant={"contained"} size={"large"} onClick={() => {
                                            freeze();
                                }}>{freezeState ? 'Freeze' : 'Unfreeze'}</Button>
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

export default FreezeAccount;
