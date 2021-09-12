import './ConnectWallet.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles, Typography, CircularProgress, Button
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {connect, hideConnectWallet} from "../../redux/actions/connectWallet";
import {Close, Power, ChevronRightSharp, ArrowBack} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import {getSupportedSigners, SupportedSigner} from "@algodesk/core";
import {Alert} from '@material-ui/lab';
import {useEffect, useState} from "react";
import {loadAccount} from "../../redux/actions/account";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface ConnectWalletState{
    view: string,
    selectedSigner: SupportedSigner
}

const signers = getSupportedSigners();
const initialState: ConnectWalletState = {
    view: "home",
    selectedSigner: signers[0]
};

function ConnectWallet(): JSX.Element {

    const dispatch = useDispatch();

    const connectWallet = useSelector((state: RootState) => state.connectWallet);
    const {accounts} = connectWallet;

    const classes = useStyles();
    const [
        { view, selectedSigner },
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

    useEffect(() => {
        if (accounts.length === 1) {
            clearState();
        }
    }, [accounts]);

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
                    <div>
                        {view === 'accounts' ? <IconButton color="default" onClick={() => {
                            // updateView('home');
                            setState(prevState => ({ ...prevState, view: 'home' }));
                        }}>
                            <ArrowBack />
                        </IconButton> : ''}

                    </div>
                    <IconButton color="default" onClick={() => {
                        dispatch(hideConnectWallet());
                        clearState();
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
                                                         setState(prevState => ({ ...prevState, view: 'accounts', selectedSigner: signer }));
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
                                    {selectedSigner.logo ? <img className="logo" src={selectedSigner.logo} alt="logo"/> : ''}
                                    <span className="name">
                                        {selectedSigner.label}
                                    </span>
                                </div>
                                <div className="body">
                                    {connectWallet.connecting ? <div className="connecting">
                                        <CircularProgress style={{color: '#000'}}></CircularProgress>
                                    </div> : ''}
                                    {!connectWallet.connecting && connectWallet.errMessage ? <div className="error-message">
                                        <div className={classes.secondaryText}>
                                            {connectWallet.errMessage}
                                        </div>
                                        <Button
                                            color={"primary"}
                                            variant={"outlined"}
                                            size={"large"}
                                            style={{marginTop: 25}}
                                            onClick={() => {
                                                dispatch(connect(selectedSigner));
                                            }}
                                        >Try again</Button>
                                    </div> : ''}
                                    {!connectWallet.connecting && accounts.length === 0 && !connectWallet.errMessage? <div className="error-message">
                                        <div className={classes.secondaryText}>
                                            No accounts found
                                        </div>
                                    </div> : ''}
                                    {accounts.map((account) => {
                                        return (<div className='account' key={account.address} onClick={async () => {
                                            const address = account.address;
                                            await dispatch(loadAccount(address));
                                            dispatch(hideConnectWallet());
                                            clearState();
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
