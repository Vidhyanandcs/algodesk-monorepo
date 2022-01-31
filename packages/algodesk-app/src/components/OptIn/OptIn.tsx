import './OptIn.scss';
import {
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, Grid,
    IconButton, InputAdornment, makeStyles, Radio, RadioGroup, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {CancelOutlined, ControlPoint, Search} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import React, {useEffect, useState} from "react";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {showTransactionDetails} from "../../redux/actions/transaction";
import {A_Asset, debounce, isNumber} from "@algodesk/core";

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
    searching: boolean,
    searchBy: string
}
const initialState: OptInState = {
    searchText: '',
    assets: [],
    searching: false,
    searchBy: 'name'
};

function OptIn(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'opt_in';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;

    const classes = useStyles();
    const [
        {assets, searchText, searching, searchBy},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState});
    };

    useEffect(() => {
        async function search() {
            try {
                setState(prevState => ({...prevState, searching: true, assets: []}));
                let result: any;

                if (searchBy === 'name') {
                    result = await algosdk.algodesk.indexer.searchForAssets().name(searchText).do();
                }
                else if (searchBy === 'id') {
                    if (isNumber(searchText)) {
                        result = await algosdk.algodesk.indexer.searchForAssets().index(Number(searchText)).do();
                    }
                    else {
                        setState(prevState => ({...prevState, searching: false}));
                    }
                }

                if (result) {
                    setState(prevState => ({...prevState, assets: result.assets, searching: false}));
                }
            }
            catch (e: any) {
                dispatch(handleException(e));
                setState(prevState => ({...prevState, searching: false}));
            }
        }

        console.log(searchText);
        if(searchText) {
            search();
        }
        else {
            setState(prevState => ({...prevState, assets: []}));
        }
    }, [searchText, dispatch, searchBy]);

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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{textAlign: "center", marginTop: -18}}>
                                <FormControl component="fieldset">
                                    <RadioGroup row={true} value={searchBy} onChange={(e) => {
                                        setState(prevState => ({...prevState, searchBy: e.currentTarget.value}));
                                    }}>
                                        <FormControlLabel value="name" control={<Radio color={"primary"}/>} label="By name"/>
                                        <FormControlLabel value="id" control={<Radio color={"primary"}/>} label="By ID"/>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                                <TextField
                                    placeholder={searchBy === 'name' ? 'Planet watch' : '87234773'}
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
                                    label="" variant="outlined" fullWidth/>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                {searching ? <div className="searching">
                                    <CircularProgress style={{marginTop: 100}}/>
                                    <div className="text">searching ...</div>
                                </div> : <div className="searched-assets">
                                    {assets.length === 0 ? <div className="no-results">
                                        No results found
                                    </div> : <div>
                                        {assets.map((asset) => {
                                            return (<div className="asset" key={asset.index}>
                                                {asset.params.name} #{asset.index}
                                                <ControlPoint onClick={() => {
                                                    optIn(asset.index);
                                                }}></ControlPoint>
                                            </div>);
                                        })}
                                    </div>}

                                </div>}

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