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
import {Close, Power, ChevronRightSharp} from "@material-ui/icons";
import {commonStyles} from "../../utils/styles";
import {getSupportedSigners, SupportedSigner} from "@algodesk/core";
import {showSnack} from '../../redux/actions/snackbar';

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
    const signers = getSupportedSigners();

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
                            <Power fontSize={"large"} color={"primary"} className="logo"></Power>
                            <Typography variant="h5" display="block" style={{fontWeight: 'bold'}}>
                                Connect wallet
                            </Typography>
                            <Typography variant="subtitle2" display="block" gutterBottom color="textSecondary">
                                to start using Algodesk
                            </Typography>
                        </div>
                        <div className="body">
                            {signers.map((signer) => {
                                return (<div className="signer"
                                             key={signer.name}
                                             onClick={async () => {
                                                 try {
                                                     // @ts-ignore
                                                     const accounts = await signer.instance.connect();
                                                     console.log(accounts);
                                                 }
                                                 catch (e) {
                                                     console.log(e);
                                                     dispatch(showSnack({
                                                         severity: 'error',
                                                         message: e.message
                                                     }));
                                                 }
                                             }}
                                >
                                    {signer.logo ? <img className="logo" src={signer.logo} alt="logo"/> : ''}
                                    <span className='name'>{signer.label}</span>
                                    <ChevronRightSharp fontSize={"large"} color={"primary"}></ChevronRightSharp>
                                </div>);
                            })}
                        </div>
                        <div className="footer">
                            <Typography variant="subtitle2" display="block" gutterBottom color="textSecondary">
                                By connecting, I accept Algodesk Terms of Service
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
