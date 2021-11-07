import './CreateAsset.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, Grid,
    IconButton, InputLabel, makeStyles, MenuItem, Select, Switch, TextField, Tooltip
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showSnack} from "../../redux/actions/snackbar";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {CancelOutlined, InfoOutlined} from "@material-ui/icons";
import React, {useState} from "react";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {A_CreateAssetParams, isNumber} from "@algodesk/core";
import sdk from 'algosdk';
import {showTransactionDetails} from "../../redux/actions/transaction";
import {getCommonStyles} from "../../utils/styles";
const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            maxWidth: 700
        }
    };
});

interface CreateAssetState extends A_CreateAssetParams {
    note: string,
    enableManager: boolean,
    enableReserve: boolean,
    enableFreeze: boolean,
    enableClawback: boolean,
}
const initialState: CreateAssetState = {
    clawback: "",
    creator: "",
    decimals: 0,
    defaultFrozen: false,
    freeze: "",
    manager: "",
    reserve: "",
    total: 1000,
    unitName: "",
    url: "",
    name: '',
    note: '',
    enableManager: true,
    enableReserve: true,
    enableFreeze: true,
    enableClawback: true,
};

export const decimalsList: number[] = [];
for (let i = 0; i <= 10; i++) {
    decimalsList.push(i);
}

export function getTooltip(message: string): JSX.Element {
    return (<Tooltip className="custom-tooltip" title={message}>
        <IconButton>
            <InfoOutlined fontSize={"small"}/>
        </IconButton>
    </Tooltip>);
}

function CreateAsset(): JSX.Element {

    const dispatch = useDispatch();
    const classes = useStyles();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'create';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const [
        {name, unitName, total, decimals, url, metadataHash, manager, reserve, freeze, clawback, note, enableManager,
        enableReserve, enableFreeze, enableClawback
        },
        setState
    ] = useState({
        ...initialState,
        manager: information.address,
        reserve: information.address,
        freeze: information.address,
        clawback: information.address
    });

    const clearState = () => {
        setState({
            ...initialState,
            manager: information.address,
            reserve: information.address,
            freeze: information.address,
            clawback: information.address
        });
    };

    function validate(name: string, unitName: string, total: number | bigint, decimals: number, manager: string, reserve: string, freeze: string, clawback: string): void {
        let message = '';

        if (!name) {
            message = 'Invalid name';
        }
        else if (name.length > 32) {
            message = 'Name cannot exceed 32 characters'
        }
        else if (!unitName) {
            message = 'Invalid unit name';
        }
        else if (unitName.length > 8) {
            message = 'Unit name cannot exceed 8 characters';
        }
        else if (!total || !isNumber(total)) {
            message = 'Invalid total supply';
        }
        else if (decimals === undefined || decimals === null || !isNumber(decimals)) {
            message = 'Invalid decimals';
        }
        else if(manager && !sdk.isValidAddress(manager)) {
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

    async function create() {
        try {
            validate(name, unitName, total, decimals, manager, reserve, freeze, clawback);
        }
        catch (e: any) {
            dispatch(showSnack({
                severity: 'error',
                message: e.message
            }));
            return;
        }

        try {
            const assetParams: A_CreateAssetParams = {
                creator: information.address,
                decimals,
                defaultFrozen: false,
                manager: manager ? manager : undefined,
                reserve: reserve ? reserve : undefined,
                freeze: freeze ? freeze : undefined,
                clawback: clawback ? clawback : undefined,
                total,
                url,
                name,
                unitName
            };

            dispatch(showLoader('Creating asset ...'));
            const {txId} = await algosdk.algodesk.assetClient.create(assetParams, note ? note : undefined);
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
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"sm"}
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
                <div className="create-asset-wrapper">
                    <div className="create-asset-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="heading">
                                    Asset details
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={name}
                                    placeholder="US Dollar"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, name: ev.target.value}));
                                    }}
                                    label="Name" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    placeholder="USDT"
                                    value={unitName}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, unitName: ev.target.value}));
                                    }}
                                    label="Unit name" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={total}
                                    placeholder="1000000"
                                    onChange={(ev) => {
                                        let value: string = "0";
                                        if(ev.target.value) {
                                            value = parseFloat(ev.target.value).toFixed(decimals);
                                        }
                                        setState(prevState => ({...prevState, total: parseFloat(value)}));
                                    }}
                                    type="number"
                                    label="Total supply" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="decimals-label">Decimals</InputLabel>
                                    <Select
                                        value={decimals}
                                        onChange={(ev) => {
                                            const dec = parseInt(ev.target.value + "");
                                            const tot = parseFloat(total + "").toFixed(dec);
                                            setState(prevState => ({...prevState, decimals: dec, total: parseFloat(tot)}));
                                        }}
                                        fullWidth
                                        labelId="decimals-label"
                                        color={"primary"}
                                        label="Decimals"
                                    >
                                        {decimalsList.map((dec) => {
                                            return <MenuItem value={dec} key={dec}>{dec}</MenuItem>;
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={url}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, url: ev.target.value}));
                                    }}
                                    multiline
                                    rows={2}
                                    placeholder="https://www.algorand.com"
                                    label="Url" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={metadataHash}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, metadataHash: ev.target.value}));
                                    }}
                                    multiline
                                    rows={2}
                                    placeholder="32 characters | 32 base64 characters | 64 Hex characters"
                                    label="Metadata hash" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="heading">
                                    Asset management
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Switch
                                    className="enable-switch"
                                    checked={enableManager}
                                    size={"small"}
                                    color={"primary"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "manager", "enableManager");
                                    }}
                                    name="manager"
                                />
                                {getTooltip('The address of the account that can manage the configuration of the asset and destroy it')}
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
                                <Switch
                                    className="enable-switch"
                                    checked={enableReserve}
                                    size={"small"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "reserve", "enableReserve");
                                    }}
                                    color={"primary"}
                                    name="reserve"
                                />
                                {getTooltip('The address of the account that holds the reserve (non-minted) units of the asset. This address has no specific authority in the protocol itself. It is used in the case where you want to signal to holders of your asset that the non-minted units of the asset reside in an account that is different from the default creator account (the sender)')}
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
                                <Switch
                                    className="enable-switch"
                                    checked={enableFreeze}
                                    size={"small"}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "freeze", "enableFreeze");
                                    }}
                                    color={"primary"}
                                    name="freeze"
                                />
                                {getTooltip('The address of the account used to freeze holdings of this asset. If empty, freezing is not permitted')}
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
                                <Switch
                                    className="enable-switch"
                                    size={"small"}
                                    checked={enableClawback}
                                    onChange={(ev) => {
                                        toggleField(ev.target.checked, "clawback", "enableClawback");
                                    }}
                                    color={"primary"}
                                    name="clawback"
                                />
                                {getTooltip('The address of the account that can clawback holdings of this asset. If empty, clawback is not permitted')}
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="modal-footer-align">
                                <Button color={"primary"}
                                        style={{marginTop: 15, marginBottom: 10}}
                                        variant={"contained"} size={"large"} onClick={() => {
                                    create();
                                }}>Create</Button>
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

export default CreateAsset;
