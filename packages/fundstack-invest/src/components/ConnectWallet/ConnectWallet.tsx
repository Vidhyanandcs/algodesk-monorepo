import './ConnectWallet.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles, Typography, Button
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {connect, hideConnectWallet} from "../../redux/actions/connectWallet";
import {ChevronRightSharp, ArrowBack, CancelOutlined} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import {getSupportedSigners, SupportedSigner} from "@algodesk/core";
import {useEffect, useState} from "react";
import {loadAccount} from "../../redux/actions/account";
import connectionIssueImg from '../../assets/images/error.gif';
import connectWhiteImg from '../../assets/images/connect-white.png';
import loaderGif from '../../assets/images/loading.gif';

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
                    <IconButton color="primary" onClick={() => {
                        dispatch(hideConnectWallet());
                        clearState();
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent style={{padding: 0}}>
                <div className="connect-wallet-wrapper">
                    <div className="connect-wallet-container">
                        {view === 'home' ? <div className="home-wrapper">
                            <div className="home-container">
                                <div className="header">
                                    <div className={classes.primaryBackground + ' logo'}>
                                        <img src={connectWhiteImg} alt="connect-wallet"/>
                                    </div>

                                    <Typography variant="h5" display="block" style={{fontWeight: 'bold'}}>
                                        Connect wallet
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
                                            <ChevronRightSharp fontSize={"large"}></ChevronRightSharp>
                                        </div>);
                                    })}
                                </div>
                                <div className="footer">
                                    <Typography variant="subtitle2" display="block" gutterBottom color="textSecondary">
                                        By connecting, I accept Fundstack Terms of Service
                                    </Typography>
                                </div>
                            </div>
                        </div> : ''}

                        {view === 'accounts' ? <div className="accounts-wrapper">
                            <div className="accounts-container">
                                <div className="header">
                                    <span className="logo">
                                        {selectedSigner.logo ? <img style={{width: 30, height: 30}} src={selectedSigner.logo} alt="logo"/> : ''}
                                    </span>
                                    <span className="name">
                                        {selectedSigner.label}
                                    </span>
                                </div>
                                <div className="body">
                                    {connectWallet.connecting ? <div className="connecting">
                                        <img src={loaderGif} alt="loading" className="loading"/>
                                        <div>connecting ...</div>
                                    </div> : ''}
                                    {!connectWallet.connecting && connectWallet.errMessage ? <div className="error-message">
                                        <img src={connectionIssueImg} alt="Connection issue"/>
                                        <div>
                                            {connectWallet.errMessage}
                                        </div>
                                        <Button
                                            color={"primary"}
                                            variant={"contained"}
                                            size={"large"}
                                            style={{marginTop: 70}}
                                            className="custom-button"
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
                                            localStorage.setItem("signer", selectedSigner.name);
                                            localStorage.setItem("address", address);
                                            clearState();
                                        }}>
                                            {account.address}
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
