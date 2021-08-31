import './ModifyAsset.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, Switch, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction, setSelectedAsset} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {Close, InfoOutlined} from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {A_ModifyAssetParams} from "@algodesk/core";
import {CustomTooltip} from '../../utils/theme';
import sdk from "algosdk";
import {showTransactionDetails} from "../../redux/actions/transaction";

interface ModifyAssetState extends A_ModifyAssetParams {
    note: string,
    enableManager: boolean,
    enableReserve: boolean,
    enableFreeze: boolean,
    enableClawback: boolean,
}
const initialState: ModifyAssetState = {
    from: "",
    assetIndex: 0,
    clawback: "",
    freeze: "",
    manager: "",
    reserve: "",
    strictEmptyAddressChecking: false,
    note: '',
    enableManager: true,
    enableReserve: true,
    enableFreeze: true,
    enableClawback: true,
};

function getTooltip(message: string): JSX.Element {
    return (<CustomTooltip className="custom-tooltip" title={message}>
        <IconButton>
            <InfoOutlined fontSize={"small"}/>
        </IconButton>
    </CustomTooltip>);
}
function ModifyAsset(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'modify';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const [
        {manager, reserve, freeze, clawback, note, enableManager, enableReserve, enableFreeze, enableClawback, assetIndex, strictEmptyAddressChecking
        },
        setState
    ] = useState({
        ...initialState
    });

    useEffect(() => {
        if (selectedAsset) {
            setState(prevState => ({
                ...prevState,
                manager: selectedAsset.params.manager,
                reserve: selectedAsset.params.reserve,
                freeze: selectedAsset.params.freeze,
                clawback: selectedAsset.params.clawback,
                assetIndex: selectedAsset.index,
                enableManager: Boolean(selectedAsset.params.manager),
                enableReserve: Boolean(selectedAsset.params.reserve),
                enableFreeze: Boolean(selectedAsset.params.freeze),
                enableClawback: Boolean(selectedAsset.params.clawback),
            }));
        }
    }, [selectedAsset]);

    const clearState = () => {
        setState(prevState => ({
            ...initialState
        }));
    };

    function validate(manager: string, reserve: string, freeze: string, clawback: string): void {
        let message = '';
        
        if(manager && !sdk.isValidAddress(manager)) {
            message = 'Invalid manager address';
        }
        else if(reserve && !sdk.isValidAddress(reserve)) {
            message = 'Invalid reserve address';
        }
        else if(freeze && !sdk.isValidAddress(freeze)) {
            message = 'Invalid freeze address';
        }
        else if(clawback && !sdk.isValidAddress(clawback)) {
            message = 'Invalid clawback address';
        }

        if (message) {
            throw new Error(message);
        }
    }

    async function modify() {
        try {
            validate(manager, reserve, freeze, clawback);
        }
        catch (e) {
            dispatch(showSnack({
                severity: 'error',
                message: e.message
            }));
            return;
        }

        try {
            const assetParams: A_ModifyAssetParams = {
                from: information.address,
                assetIndex: assetIndex,
                manager: manager ? manager : undefined,
                reserve: reserve ? reserve : undefined,
                freeze: freeze ? freeze : undefined,
                clawback: clawback ? clawback : undefined,
                strictEmptyAddressChecking: strictEmptyAddressChecking
            };

            dispatch(showLoader('Modifying asset ...'));
            const {txId} = await algosdk.algodesk.assetClient.modify(assetParams, note ? note : undefined);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showTransactionDetails(txId));
        }
        catch (e) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }

    function toggleField(checked: boolean, field: string, toggleField: string): void {
        setState(prevState => ({...prevState, [toggleField]: checked}));
        if (checked) {
            setState(prevState => ({...prevState, [field]: information.address}));
        }
        else {
            setState(prevState => ({...prevState, [field]: ''}));
        }
    }

    return (<div>
        {show && selectedAsset ? <Dialog
            fullWidth={true}
            maxWidth={"sm"}
            open={show}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>

                    </div>
                    <IconButton color="default" onClick={() => {
                        clearState();
                        dispatch(setAction(''));
                        dispatch(setSelectedAsset(null));
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="modify-asset-wrapper">
                    <div className="modify-asset-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="heading">
                                    Asset details
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={selectedAsset.params.name}
                                    disabled
                                    label="Name" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={selectedAsset.params['unit-name']}
                                    disabled
                                    label="Unit name" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={selectedAsset.params.total}
                                    disabled
                                    label="Total supply" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={selectedAsset.params.decimals}
                                    disabled
                                    label="Decimals" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={selectedAsset.params.url}
                                    disabled
                                    multiline
                                    rows={2}
                                    label="Url" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={selectedAsset.params['metadata-hash']}
                                    disabled
                                    multiline
                                    rows={2}
                                    label="Metadata hash" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="heading">
                                    Asset management
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                {getTooltip('The address of the account that can manage the configuration of the asset and destroy it')}
                                <Switch
                                    className="enable-switch"
                                    checked={enableManager}
                                    disabled={!Boolean(selectedAsset.params.manager)}
                                    size={"small"}
                                    color={"primary"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "manager", "enableManager");
                                    }}
                                    name="manager"
                                />
                                <TextField
                                    value={manager}
                                    disabled={!enableManager}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, manager: ev.target.value}));
                                    }}
                                    className="asset-manage-field address-field"
                                    multiline
                                    rows={2}
                                    label="Manager" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                {getTooltip('The address of the account that holds the reserve (non-minted) units of the asset. This address has no specific authority in the protocol itself. It is used in the case where you want to signal to holders of your asset that the non-minted units of the asset reside in an account that is different from the default creator account (the sender)')}
                                <Switch
                                    className="enable-switch"
                                    checked={enableReserve}
                                    disabled={!Boolean(selectedAsset.params.reserve)}
                                    size={"small"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "reserve", "enableReserve");
                                    }}
                                    color={"primary"}
                                    name="reserve"
                                />
                                <TextField
                                    value={reserve}
                                    multiline
                                    disabled={!enableReserve}
                                    rows={2}
                                    className="asset-manage-field address-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, reserve: ev.target.value}));
                                    }}
                                    label="Reserve" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                {getTooltip('The address of the account used to freeze holdings of this asset. If empty, freezing is not permitted')}
                                <Switch
                                    className="enable-switch"
                                    checked={enableFreeze}
                                    disabled={!Boolean(selectedAsset.params.freeze)}
                                    size={"small"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "freeze", "enableFreeze");
                                    }}
                                    color={"primary"}
                                    name="freeze"
                                />
                                <TextField
                                    value={freeze}
                                    multiline
                                    disabled={!enableFreeze}
                                    rows={2}
                                    className="asset-manage-field address-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, freeze: ev.target.value}));
                                    }}
                                    label="Freeze" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                {getTooltip('The address of the account that can clawback holdings of this asset. If empty, clawback is not permitted')}
                                <Switch
                                    className="enable-switch"
                                    size={"small"}
                                    checked={enableClawback}
                                    disabled={!Boolean(selectedAsset.params.clawback)}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "clawback", "enableClawback");
                                    }}
                                    color={"primary"}
                                    name="clawback"
                                />
                                <TextField
                                    value={clawback}
                                    multiline
                                    disabled={!enableClawback}
                                    rows={2}
                                    className="asset-manage-field address-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, clawback: ev.target.value}));
                                    }}
                                    label="Clawback" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    value={note}
                                    multiline
                                    rows={2}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, note: ev.target.value}));
                                    }}
                                    label="Note" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Button color={"primary"}
                                        style={{marginTop: 15, marginBottom: 10}}
                                        fullWidth variant={"contained"} size={"large"} onClick={() => {
                                    modify();
                                }}>Modify</Button>
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

export default ModifyAsset;
