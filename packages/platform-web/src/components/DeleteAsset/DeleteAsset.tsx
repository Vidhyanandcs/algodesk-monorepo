import './DeleteAsset.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {showLoader, hideLoader} from "../../redux/actions/loader";
import {Close} from "@material-ui/icons";
import React from "react";
import algosdk from "../../utils/algosdk";
import {handleException} from "../../redux/actions/exception";
import {loadAccount} from "../../redux/actions/account";
import {getCommonStyles} from "../../utils/styles";
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

function DeleteAsset(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const {selectedAsset} = assetActions;
    const show = assetActions.action === 'delete';
    const account = useSelector((state: RootState) => state.account);
    const {information} = account;
    const classes = useStyles();

    async function deleteAsset(){
        try {
            dispatch(showLoader('Deleting asset ...'));
            const {txId} = await algosdk.algodesk.assetClient.destroy(information.address, selectedAsset.index);
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await algosdk.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(loadAccount(information.address));
            dispatch(showTransactionDetails(txId));
        }
        catch (e) {
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
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="delete-asset-wrapper">
                    <div className="delete-asset-container">


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
                                <div className='message'>
                                    Are you sure, you want to delete the asset ?
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 20, marginBottom: 20}}>
                                    <Button color={"default"} variant={"outlined"} size={"large"}
                                            onClick={() => {
                                                dispatch(setAction(''));
                                            }}
                                            style={{marginRight: 15}}
                                    >Cancel</Button>
                                    <Button color={"secondary"} variant={"contained"} size={"large"}
                                            onClick={() => {
                                                deleteAsset();
                                            }}
                                    >Delete</Button>
                                </div>
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

export default DeleteAsset;
