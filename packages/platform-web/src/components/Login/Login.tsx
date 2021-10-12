import './Login.scss';
import {
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {Power} from "@material-ui/icons";
import {showConnectWallet} from '../../redux/actions/connectWallet';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Redirect} from "react-router-dom";
import {getNetworks, NETWORKS} from "@algodesk/core";
import {CustomButton} from '../../utils/theme';
import Logo from '../Logo/Logo';


function Login(): JSX.Element {
    const dispatch = useDispatch();
    let networks = getNetworks();

    networks = networks.filter((network) => {
        return network.name !== NETWORKS.BETANET;
    });

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
                      <Logo></Logo>
                      <div className="login-form">
                          <div className="networks">
                              <div className="title">Connect wallet</div>
                              <FormControl component="fieldset">
                                  <RadioGroup row={true} value={currentNetwork.name} onChange={(e) => {
                                      let domain = e.currentTarget.value;
                                      if (domain === NETWORKS.MAINNET) {
                                          domain = 'app';
                                      }
                                      window.location.href = 'https://' + domain + '.algodesk.io';
                                  }}>
                                      {networks.map((network) => {
                                          return <FormControlLabel value={network.name} key={network.name} control={<Radio color={"primary"}/>} label={network.label} />
                                      })}
                                  </RadioGroup>
                              </FormControl>


                              {/*<ButtonGroup variant="outlined" color="primary">*/}
                              {/*    {networks.map((network) => {*/}
                              {/*        return (<Button key={network.name} size={"small"} variant={currentNetwork.name === network.name ? 'contained' : 'outlined'} onClick={() => {*/}
                              {/*            let domain = network.name;*/}
                              {/*            if (network.name === NETWORKS.MAINNET) {*/}
                              {/*                domain = 'app';*/}
                              {/*            }*/}
                              {/*            window.location.href = 'https://' + domain + '.algodesk.io';*/}
                              {/*        }}>{network.label}</Button>);*/}
                              {/*    })}*/}
                              {/*</ButtonGroup>*/}
                          </div>
                          <div className="login-button">
                              <CustomButton
                                  variant={"contained"}
                                  size={"large"}
                                  color={"primary"}
                                  startIcon={<Power></Power>}
                                  onClick={() => {
                                      dispatch(showConnectWallet());
                                  }}
                              >Connect Wallet</CustomButton>
                          </div>
                          <Typography variant="caption" display="block" gutterBottom color="textSecondary">

                          </Typography>
                      </div>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Login;
