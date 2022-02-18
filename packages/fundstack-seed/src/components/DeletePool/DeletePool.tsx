import './DeletePool.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CancelOutlined} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";
import {setAction} from "../../redux/actions/pool";
import {hideLoader, showLoader} from "../../redux/actions/loader";
import fSdk from "../../utils/fSdk";
import {loadAccount} from "../../redux/actions/account";
import {handleException} from "../../redux/actions/exception";
import {showSuccessModal} from "../../redux/actions/successModal";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function DeletePool(): JSX.Element {

    const dispatch = useDispatch();

    const poolDetails = useSelector((state: RootState) => state.pool);
    const accountDetails = useSelector((state: RootState) => state.account);
    const show = poolDetails.action === 'delete';
    const {pool} = poolDetails;
    const classes = useStyles();
    const history = useHistory();


    async function deletePool(){
        try {
            dispatch(showLoader('Deleting pool ...'));
            const {txId} = await fSdk.fs.delete(Number(pool.id));
            dispatch(hideLoader());
            dispatch(showLoader('Waiting for confirmation ...'));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(loadAccount(accountDetails.information.address));
            dispatch(showSuccessModal('Delete successfully'));
            history.push('/portal/dashboard/pools/home');
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
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="delete-pool-wrapper">
                    <div className="delete-pool-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className='message'>
                                    Are you sure, you want to delete this pool ?
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 10, marginBottom: 5, textAlign: "center"}}>
                                    <Button
                                        color={"secondary"}
                                        variant={"contained"}
                                        size={"large"}
                                        className="custom-button"
                                            onClick={() => {
                                                deletePool();
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

export default DeletePool;
