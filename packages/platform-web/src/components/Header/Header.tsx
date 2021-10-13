import './Header.scss';
import {Box, Button, Grid} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Logo from "../Logo/Logo";
import {getNetworks, NETWORKS} from "@algodesk/core";
import {CustomButtonGroup} from '../../utils/theme';
import {setNetwork} from "../Settings/Settings";
import {setNetwork as selectNetwork} from "../../redux/actions/network";
import {loadAccount} from "../../redux/actions/account";


function Header(): JSX.Element {
    let networks = getNetworks();

    networks = networks.filter((network) => {
        return network.name !== NETWORKS.BETANET;
    });

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
                            <CustomButtonGroup variant="outlined" color="primary" style={{marginTop: 2}}>
                                {networks.map((network) => {
                                    return (<Button key={network.name} variant={currentNetwork.name === network.name ? 'contained' : 'outlined'} onClick={() => {
                                        setNetwork(network.name);
                                        dispatch(selectNetwork(network.name));
                                        dispatch(loadAccount(address));
                                    }}>{network.label}</Button>);
                                })}
                            </CustomButtonGroup>
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
