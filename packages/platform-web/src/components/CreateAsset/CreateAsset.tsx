import './CreateAsset.scss';
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
import {Close} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useState} from "react";
import {getNumberInputValue, isNumber} from "../../utils/core";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {A_CreateAssetParams} from "@algodesk/core";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 50
        }
    };
});

interface SendAssetState extends A_CreateAssetParams {
    note: string
}
const initialState: SendAssetState = {
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
    note: ''
};

function CreateAsset(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'create';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {name, unitName, total, decimals, url, metadataHash, manager, reserve, freeze, clawback, note},
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

    function validate(name: string, unitName: string, total: number | bigint, decimals: number): void {
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

        if (message) {
            throw new Error(message);
        }
    }

    async function create() {
        try {
            validate(name, unitName, total, decimals);
        }
        catch (e) {
            dispatch(showSnack({
                severity: 'error',
                message: e.message
            }));
            return;
        }

        try {
            const assetParams: A_CreateAssetParams = {
                clawback,
                creator: information.address,
                decimals,
                defaultFrozen: false,
                freeze,
                manager,
                reserve,
                total,
                url,
                name,
                unitName
            };
            dispatch(showLoader('Creating asset ...'));
            const {txId} = await algosdk.algodesk.assetClient.create(assetParams);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            clearState();
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showSnack({
                severity: 'success',
                message: 'Asset created successfully'
            }));
        }
        catch (e) {
            dispatch(handleException(e));
            dispatch(hideLoader());
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
                        Create asset
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
                                        const value = getNumberInputValue(ev.target.value);
                                        if (value !== undefined) {
                                            setState(prevState => ({...prevState, total: value}));
                                        }
                                    }}
                                    label="Total supply" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    required
                                    value={decimals}
                                    placeholder="0"
                                    onChange={(ev) => {
                                        const value = getNumberInputValue(ev.target.value);
                                        if (value !== undefined) {
                                            setState(prevState => ({...prevState, decimals: value}));
                                        }
                                    }}
                                    label="Decimals" variant="outlined" fullWidth/>
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
                                <TextField
                                    value={manager}
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, manager: ev.target.value}));
                                    }}
                                    className="asset-manage-field"
                                    multiline
                                    rows={2}
                                    label="Manager" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={reserve}
                                    multiline
                                    rows={2}
                                    className="asset-manage-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, reserve: ev.target.value}));
                                    }}
                                    label="Reserve" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={freeze}
                                    multiline
                                    rows={2}
                                    className="asset-manage-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, freeze: ev.target.value}));
                                    }}
                                    label="Freeze" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <TextField
                                    value={clawback}
                                    multiline
                                    rows={2}
                                    className="asset-manage-field"
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
                                    className="asset-manage-field"
                                    onChange={(ev) => {
                                        setState(prevState => ({...prevState, note: ev.target.value}));
                                    }}
                                    label="Note" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>

                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Button color={"primary"}
                                        style={{marginTop: 15, marginBottom: 10}}
                                        fullWidth variant={"contained"} size={"large"} onClick={() => {
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
