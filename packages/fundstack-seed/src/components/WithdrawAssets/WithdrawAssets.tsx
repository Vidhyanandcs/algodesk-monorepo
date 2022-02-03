import './WithdrawAssets.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CancelOutlined} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";
import {setAction, withdraw} from "../../redux/actions/fund";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function WithdrawAssets(): JSX.Element {

    const dispatch = useDispatch();

    const fund = useSelector((state: RootState) => state.fund);
    const show = fund.action === 'withdraw';
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
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="withdraw-assets-wrapper">
                    <div className="withdraw-assets-container">
                        <div className="withdraw">
                            <header className={classes.primaryText}>Withdraw</header>
                            <div className="item">
                                This project didn't meet the success criteria.
                                You can withdraw your assets from escrow to your account.
                            </div>

                            <div className="item">
                                <Button
                                    fullWidth
                                    color={"primary"}
                                    variant={"contained"}
                                    size={"large"}
                                    className="custom-button"
                                    onClick={async () => {
                                        dispatch(withdraw(Number(fund.fund.id)));
                                    }}
                                >Agree & withdraw</Button>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default WithdrawAssets;
