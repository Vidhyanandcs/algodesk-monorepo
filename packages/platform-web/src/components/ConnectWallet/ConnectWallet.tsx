import './ConnectWallet.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles, Typography
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {connect, hideConnectWallet} from "../../redux/actions/connectWallet";
import {Close, Power, ChevronRightSharp, ArrowBack} from "@material-ui/icons";
import {commonStyles} from "../../utils/styles";
import {getSupportedSigners, SupportedSigner} from "@algodesk/core";
import {Alert} from '@material-ui/lab';
import {useState} from "react";

const useStyles = makeStyles({
    ...commonStyles,
    customDialog: {
        position: "absolute",
        top: 100
    }
});


function ConnectWallet(): JSX.Element {

    const dispatch = useDispatch();

    const connectWallet = useSelector((state: RootState) => state.connectWallet);
    const {accounts} = connectWallet;

    const classes = useStyles();
    const signers = getSupportedSigners();
    const [view, updateView] = useState<string>('home');
    const [selectedSigner, updateSelectedSigner] = useState<SupportedSigner>(signers[0]);

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
                        {view === 'home' ? <div className="home-wrapper">
                            <div className="home-container">
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
                                                     onClick={() => {
                                                         dispatch(connect(signer));
                                                         updateView('accounts');
                                                         updateSelectedSigner(signer);
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
                        </div> : ''}

                        {view === 'accounts' ? <div className="accounts-wrapper">
                            <div className="accounts-container">
                                <div className="header">
                                    <Button
                                        size={"small"}
                                        color="primary"
                                        variant={"text"}
                                        startIcon={<ArrowBack></ArrowBack>}
                                        onClick={() => {
                                            updateView('home');
                                        }}>
                                        Back
                                    </Button>
                                    <span className="name">
                                        {selectedSigner.label}
                                    </span>
                                </div>
                                <div className="body">
                                    {accounts.map((account) => {
                                        return (<div className='account' key={account.address} onClick={() => {
                                            const address = account.address;
                                        }}>
                                            <Alert
                                                severity="warning" icon={false}>
                                                {account.address}
                                            </Alert>

                                        </div>);
                                    })}
                                </div>
                            </div>
                        </div> : ''}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default ConnectWallet;
