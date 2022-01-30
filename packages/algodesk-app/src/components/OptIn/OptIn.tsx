import './OptIn.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, InputAdornment, makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {CancelOutlined, Search} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useEffect, useState} from "react";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {showTransactionDetails} from "../../redux/actions/transaction";
import {A_Asset, debounce} from "@algodesk/core";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface OptInState{
    searchText: string,
    assets: A_Asset[],
    searching: boolean
}
const initialState: OptInState = {
    searchText: '',
    assets: [],
    searching: false
};

function OptIn(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'opt_in';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {assets, searchText},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState});
    };

    useEffect(() => {
        async function search() {
            try {
                dispatch(showLoader('Searching ...'));
                const result = await algosdk.algodesk.indexer.searchForAssets().name(searchText).do();
                setState(prevState => ({...prevState, assets: result.assets}));
                dispatch(hideLoader());
            }
            catch (e: any) {
                dispatch(handleException(e));
                dispatch(hideLoader());
            }
        }

        if(searchText) {
            search();
        }
    }, [searchText, dispatch]);

    async function optIn(assetId: number) {
        try {
            dispatch(showLoader('Opting in ...'));

            const {txId} = await algosdk.algodesk.assetClient.optIn(account.information.address, assetId);
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
                        clearState();
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="opt-in-wrapper">
                    <div className="opt-in-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    placeholder="Planet watch"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" style={{color: '#828282'}}>
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(ev) => {
                                        debounce(() => {
                                            setState(prevState => ({...prevState, searchText: ev.target.value}));
                                        }, 1000)();
                                    }}
                                    label="Asset name" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="searched-assets">
                                    {assets.map((asset) => {
                                        return (<div className="asset" key={asset.index} onClick={() => {
                                            optIn(asset.index);
                                        }}>
                                            {asset.params.name}# {asset.index}
                                        </div>);
                                    })}
                                </div>
                            </Grid>
                        </Grid>



                        <div>

                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default OptIn;
