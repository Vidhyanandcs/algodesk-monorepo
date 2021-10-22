import './Login.scss';
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {showConnectWallet} from '../../redux/actions/connectWallet';
import {setNetwork as selectNetwork} from '../../redux/actions/network';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Redirect} from "react-router-dom";
import {getNetworks} from "@algodesk/core";
import Logo from '../Logo/Logo';
import {setNetwork} from "../Settings/Settings";
import connectWhiteImg from '../../assets/images/connect-white.png';


function Login(): JSX.Element {
    const dispatch = useDispatch();
    let networks = getNetworks();

    const account = useSelector((state: RootState) => state.account);
    const currentNetwork = useSelector((state: RootState) => state.network);

    if (account.loggedIn) {
        return (<Redirect to='/portal'></Redirect>);
    }

  return (
      <div className="login-wrapper">
          <div className="login-container">
              <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Grid container>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>

                          </Grid>
                          <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                              <Logo></Logo>
                          </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                          <Grid item xs={12} sm={2} md={4} lg={4} xl={4}>

                          </Grid>
                          <Grid item xs={12} sm={8} md={4} lg={4} xl={4}>
                              <div className="login-form">
                                  <div className="networks">
                                      <div className="title">Connect wallet</div>
                                      <FormControl component="fieldset">
                                          <RadioGroup row={true} value={currentNetwork.name} onChange={(e) => {
                                              const network = e.currentTarget.value;
                                              setNetwork(network);
                                              dispatch(selectNetwork(network));
                                          }}>
                                              {networks.map((network) => {
                                                  return <FormControlLabel value={network.name} key={network.name} control={<Radio color={"primary"}/>} label={network.label}/>
                                              })}
                                          </RadioGroup>
                                      </FormControl>
                                  </div>
                                  <div className="login-button">
                                      <Button
                                          variant={"contained"}
                                          size={"large"}
                                          color={"primary"}
                                          startIcon={<img src={connectWhiteImg} alt="connect-wallet" style={{width: 20}}/>}
                                          onClick={() => {
                                              dispatch(showConnectWallet());
                                          }}
                                      >Connect Wallet</Button>
                                  </div>
                                  <Typography variant="caption" display="block" gutterBottom color="textSecondary">

                                  </Typography>
                              </div>
                          </Grid>
                          <Grid item xs={12} sm={2} md={4} lg={4} xl={4}>

                          </Grid>
                      </Grid>

                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Login;
