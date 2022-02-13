import './OptIn.scss';
import {
    Button, ButtonGroup,
    CircularProgress,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, InputBase, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {CancelOutlined, AddCircle, Search} from "@material-ui/icons";
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{textAlign: "center", height: 60}}>

                                <ButtonGroup variant="outlined" color="primary" fullWidth>
                                    <Button variant={searchBy === 'name' ? 'contained' : 'outlined'} onClick={() => {
                                        setState(prevState => ({...prevState, searchBy: 'name'}));
                                    }}>Asset Name</Button>
                                    <Button variant={searchBy === 'id' ? 'contained' : 'outlined'} onClick={() => {
                                        setState(prevState => ({...prevState, searchBy: 'id'}));
                                    }}>Asset Id</Button>
                                </ButtonGroup>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                                <InputBase
                                    placeholder={searchBy === 'name' ? 'Planet watch' : '87234773'}

                                    onChange={(ev) => {
                                        debounce(() => {
                                            setState(prevState => ({...prevState, searchText: ev.target.value}));
                                        }, 1000)();
                                    }}
                                    endAdornment={<Search color={"primary"}></Search>}
                                    fullWidth style={{background: '#F6FBF8', padding: 15, borderRadius: 10}}/>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                {searching ? <div className="searching">
                                    <CircularProgress style={{marginTop: 100}}/>
                                    <div className="text">searching ...</div>
                                </div> : <div>

                                    {assets.length === 0 ? <div className="no-results">
                                        No results found
                                    </div> : <div className="searched-assets">
                                        {assets.map((asset) => {
                                            return (<div className="asset" key={asset.index}>
                                                <span className={classes.primaryText}>{asset.params.name}</span>
                                                <div style={{marginTop: 10}}>ID: {asset.index}</div>
                                                <AddCircle color={"primary"} onClick={() => {
                                                    optIn(asset.index);
                                                }}></AddCircle>
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
