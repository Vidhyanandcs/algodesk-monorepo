import './TransactionDetails.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CheckCircleOutline, Cancel} from "@material-ui/icons";
import React from "react";
import {hideTransactionDetails} from "../../redux/actions/transaction";
import {getCommonStyles} from "../../utils/styles";
import {openTransactionInExplorer} from "../../utils/core";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function TransactionDetails(): JSX.Element {

    const dispatch = useDispatch();
    const transaction = useSelector((state: RootState) => state.transaction);
    const {show, txId} = transaction;
    const classes = useStyles();

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
                        dispatch(hideTransactionDetails());
                    }}>
                        <Cancel />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="transaction-details-wrapper">
                    <div className="transaction-details-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-details">
                                    <div>
                                        <CheckCircleOutline fontSize={"large"} className="success-icon" color={"primary"}></CheckCircleOutline>
                                    </div>
                                    <div className="name">
                                        Transaction successful
                                    </div>
                                    <div className="id">
                                        {txId}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 20, marginBottom: 30}}>
                                    <Button color={"primary"} variant={"contained"} size={"large"}
                                            onClick={() => {
                                                openTransactionInExplorer(txId);
                                            }}
                                    >View transaction</Button>
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

export default TransactionDetails;
