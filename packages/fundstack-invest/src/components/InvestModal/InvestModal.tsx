import './InvestModal.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, InputAdornment, makeStyles, TextField
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {invest, setAction} from "../../redux/actions/pool";
import {CancelOutlined} from "@material-ui/icons";
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";
import {globalStateKeys} from "@fundstack/sdk";
import {microalgosToAlgos} from "algosdk";
import fSdk from "../../utils/fSdk";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

interface InvestModalState{
    amount: string,
    payableAmount: number
}

const initialState: InvestModalState = {
    amount: '',
    payableAmount: 0
};

function InvestModal(): JSX.Element {
    const dispatch = useDispatch();
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {action} = poolDetails;
    const show = action === 'invest';
    const classes = useStyles();

    const [
        { amount, payableAmount },
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

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
                        clearState();
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="invest-modal-wrapper">
                    <div className="invest-modal-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="exchange-ratio">
                                    Price: 1 {pool.asset.params["unit-name"]} = {microalgosToAlgos(pool.globalState[globalStateKeys.price])} Algos
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-section">
                                    <div className="header-text">
                                        You receive

                                        <div className="float-btn" onClick={() => {
                                            const amount = fSdk.fs.getMaxAllocationInDecimals(pool);
                                            const payableAmount = fSdk.fs.calculatePayableAmount(amount, pool);
                                            setState(prevState => ({...prevState, amount: amount + '', payableAmount}));
                                        }}>Max</div>

                                        <div className="float-btn" onClick={() => {
                                            const amount = fSdk.fs.getMinAllocationInDecimals(pool);
                                            const payableAmount = fSdk.fs.calculatePayableAmount(amount, pool);
                                            setState(prevState => ({...prevState, amount: amount + '', payableAmount}));
                                        }}>Min</div>

                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField variant="outlined"
                                                       fullWidth
                                                       required
                                                       value={amount}
                                                       type="number"
                                                       onChange={(ev) => {
                                                           const val = ev.target.value;

                                                           const payableAmount = fSdk.fs.calculatePayableAmount(val ? Number(val) : 0, pool);
                                                           setState(prevState => ({...prevState, amount: val, payableAmount}));
                                                       }}
                                                       InputProps={{
                                                           endAdornment: <InputAdornment position="end" color="primary">
                                                               {pool.asset.params["unit-name"]}
                                                           </InputAdornment>,
                                                       }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>

                                <div className="asset-section highlight">
                                    <div className="header-text">
                                        You pay
                                    </div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={7} md={8} lg={8} xl={8}>
                                            <div className="white-back">
                                                <div className="amount">{payableAmount}</div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>

                                        </Grid>
                                        <Grid item xs={12} sm={4} md={3} lg={3} xl={3}>
                                            <span className="payment-asset">Algos</span>
                                        </Grid>
                                    </Grid>
                                </div>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 10, textAlign: "center"}}>
                                    <Button color={"primary"}
                                            className="custom-button"
                                            variant={"contained"} size={"large"}
                                            onClick={() => {
                                                dispatch(invest({pool, amount}));
                                            }}
                                    >Invest</Button>
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

export default InvestModal;
