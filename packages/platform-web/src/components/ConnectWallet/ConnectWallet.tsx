import './ConnectWallet.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles, Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {hideConnectWallet} from "../../redux/actions/connectWallet";
import {Close} from "@material-ui/icons";
import {commonStyles} from "../../utils/styles";

const useStyles = makeStyles({
    ...commonStyles,
    customDialog: {
        position: "absolute",
        top: 100
    }
});

function ConnectWallet(): JSX.Element {

    const connectWallet = useSelector((state: RootState) => state.connectWallet);
    const dispatch = useDispatch();
    const classes = useStyles();

    return (<div>
        {connectWallet.show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={connectWallet.show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div></div>
                    <IconButton color="default" onClick={() => {
                        dispatch(hideConnectWallet())
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="connect-wallet-wrapper">
                    <div className="connect-wallet-container">
                        <div className="header">
                            <Typography variant="h5" display="block" style={{fontWeight: 'bold'}}>
                                Connect wallet
                            </Typography>
                            <Typography variant="subtitle2" display="block" gutterBottom color="textSecondary">
                                to start using Algodesk
                            </Typography>
                        </div>

                    </div>
                </div>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default ConnectWallet;
