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
import {invest, setAction} from "../../redux/actions/fund";
import {CancelOutlined} from "@material-ui/icons";
import React, {useState} from "react";
import {getCommonStyles} from "../../utils/styles";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {microalgosToAlgos} from "algosdk";
import fundstackSdk from "../../utils/fundstackSdk";

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
    amount: number,
    payableAmount: number
}

const initialState: InvestModalState = {
    amount: 0,
    payableAmount: 0
};

function InvestModal(): JSX.Element {
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {action} = fundDetails;
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
                                    Price: 1 {fund.asset.params["unit-name"]} = {microalgosToAlgos(fund.globalState[globalStateKeys.price])} Algos
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-section">
                                    <div className="header-text">
                                        You receive

                                        <div className="float-btn" onClick={() => {
                                            const amount = fundstackSdk.fundstack.getMaxAllocationInDecimals(fund);
                                            const payableAmount = fundstackSdk.fundstack.calculatePayableAmount(amount, fund);
                                            setState(prevState => ({...prevState, amount, payableAmount}));
                                        }}>Max</div>

                                        <div className="float-btn" onClick={() => {
                                            const amount = fundstackSdk.fundstack.getMinAllocationInDecimals(fund);
                                            const payableAmount = fundstackSdk.fundstack.calculatePayableAmount(amount, fund);
                                            setState(prevState => ({...prevState, amount, payableAmount}));
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
                                                           let value: string = "0";
                                                           if(ev.target.value) {
                                                               value = parseFloat(ev.target.value).toFixed(fund.asset.params.decimals);
                                                           }
                                                           const amount = parseFloat(value);
                                                           const payableAmount = fundstackSdk.fundstack.calculatePayableAmount(amount, fund);
                                                           setState(prevState => ({...prevState, amount, payableAmount}));
                                                       }}
                                                       InputProps={{
                                                           endAdornment: <InputAdornment position="end" color="primary">
                                                               {fund.asset.params["unit-name"]}
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
                                            variant={"contained"} size={"large"}
                                            onClick={() => {
                                                dispatch(invest({fund, amount}));
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
