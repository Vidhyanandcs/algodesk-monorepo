import './BurnSupply.scss';
import {
    Button, Checkbox,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, InputAdornment, makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {loadBurnerVault, setAction} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {CancelOutlined} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useEffect, useState} from "react";
import algosdk from "../../utils/algosdk";
import sdk from 'algosdk';
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {showTransactionDetails} from "../../redux/actions/transaction";
import {A_TransferAssetParams, BURN_ADDRESS_MIN_BAL, isNumber} from "@algodesk/core";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface BurnSupplyState{
    amount: number,
    note: string,
    confirmed: boolean
}
const initialState: BurnSupplyState = {
    amount: 0,
    note: '',
    confirmed: false
};

function BurnSupply(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const {burnDetails} = assetActions;
    const show = assetActions.action === 'burn';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {amount, note, confirmed},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    useEffect(() => {
        if (show && selectedAsset) {
            dispatch(loadBurnerVault(selectedAsset.index));
        }
    }, [dispatch, selectedAsset, show]);

    async function burn() {
        const to = burnDetails.burnerVault.accountInfo.address;
        if (!to || !sdk.isValidAddress(to)) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Invalid burner vault address'
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
        if (amount <=0) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Amount should be greater than 0'
            }));
            return;
        }
        if (!confirmed) {
            dispatch(showSnack({
                severity: 'error',
                message: 'Please confirm your transaction by selecting the checkbox'
            }));
            return;
        }
        try {
            dispatch(showLoader('Burning ...'));

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

    async function deploy() {
        try {
            dispatch(showLoader('Deploying burner vault ...'));

            const {txId} = await algosdk.algodesk.assetClient.deployBurnerVault(account.information.address, selectedAsset.index);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(loadBurnerVault(selectedAsset.index));
            dispatch(showSnack({
                severity: 'success',
                message: "Burner vault deployed successfully"
            }));
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
                <div className="burn-assets-wrapper">
                    <div className="burn-assets-container">

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
                        </Grid>
                        {burnDetails.loading ? <div className="loading">
                            <CircularProgress />
                            <div className="text">Loading burner vault ...</div>
                        </div> : <div>
                            {burnDetails.burnerVault && burnDetails.burnerVault.active ? <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <TextField
                                        required
                                        value={burnDetails.burnerVault.accountInfo.address}
                                        onChange={(ev) => {
                                            setState(prevState => ({...prevState, to: ev.target.value}));
                                        }}
                                        disabled
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" color="primary"><Button color="primary" onClick={() => {
                                                algosdk.explorer.openAccount(burnDetails.burnerVault.accountInfo.address);
                                            }
                                            }>View</Button></InputAdornment>,
                                        }}
                                        className="address-field"
                                        label="Burner vault address" variant="outlined" rows={2} fullWidth multiline/>
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
                                                       const totalBalance = algosdk.algodesk.accountClient.getAssetBal(selectedAsset, information);
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
                                    <Alert severity={"warning"} icon={false} className="alert-message">
                                        <Checkbox
                                            style={{padding: 0, paddingRight: 5}}
                                            color={"secondary"} checked={confirmed} onChange={(ev, value) => {
                                            setState((prevState) => ({ ...prevState, confirmed: value }));
                                        }}/>
                                        The assets are locked in burner vault address forever.
                                        I understand that burned assets cannot be recovered and this transaction cannot be reversed.
                                        Algodesk is not responsible for any of your assets.
                                    </Alert>
                                </Grid>



                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="modal-footer-align">
                                    <Button color={"secondary"}
                                            style={{marginTop: 10}}
                                            variant={"contained"} size={"large"} onClick={() => {
                                        burn();
                                    }}>Burn</Button>
                                </Grid>
                            </Grid> : <div className="burner-vault-setup">
                                <div className="text">
                                    Burner vault for this asset is not available. Do you want to deploy one ?
                                    It is a one time setup and costs {algosdk.algodesk.assetClient.getBurnerVaultCharges()} Algo
                                </div>

                                <Alert severity={"warning"} icon={false} className="alert-message">
                                    Please note that {BURN_ADDRESS_MIN_BAL} Algo is a minimun balance requirement for any address(Vault) to hold an asset.
                                    Algodesk doesn't charge anything for this. This feature is currently enabled only on the TestNet and BetaNet. This feature is highly experimental and please use at your own risk.
                                </Alert>

                                <div>
                                    <Button color={"primary"}
                                            variant={"contained"}
                                            size={"large"}
                                            style={{marginTop: 30}}
                                            onClick={() => {
                                                deploy();
                                            }}
                                    >Deploy</Button>
                                </div>

                            </div>}
                        </div>}

                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default BurnSupply;
