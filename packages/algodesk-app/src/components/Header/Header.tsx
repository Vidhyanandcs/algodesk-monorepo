import './Header.scss';
import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Logo from "../Logo/Logo";
import {getNetworks, setLocalNetwork} from "@algodesk/core";
import {setNetwork as selectNetwork} from "../../redux/actions/network";
import {loadAccount} from "../../redux/actions/account";
import algosdk from "../../utils/algosdk";
import {showSnack} from "../../redux/actions/snackbar";


function Header(): JSX.Element {
    let networks = getNetworks();

    const account = useSelector((state: RootState) => state.account);
    const {address} = account.information;
    const currentNetwork = useSelector((state: RootState) => state.network);
    const dispatch = useDispatch();

    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <Box display="flex" p={1} alignItems="flex-start">
                        <Box p={1} flexGrow={1}>
                            <div className={"logo "}>
                                <Logo></Logo>
                            </div>
                        </Box>
                        <Box p={1}>
                            <ButtonGroup variant="outlined" size="small" color="primary" style={{marginTop: 2}}>
                                {networks.map((network) => {
                                    return (<Button key={network.name} variant={currentNetwork.name === network.name ? 'contained' : 'outlined'} onClick={() => {
                                        const {name} = network;
                                        if (algosdk.signer.isNetworkSupported(name)) {
                                            setLocalNetwork(name);
                                            dispatch(selectNetwork(name));
                                            dispatch(loadAccount(address));
                                        }
                                        else {
                                            dispatch(showSnack({
                                                severity: 'error',
                                                message: 'Network not supported'
                                            }));
                                        }
                                    }}>{network.label}</Button>);
                                })}
                            </ButtonGroup>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;
