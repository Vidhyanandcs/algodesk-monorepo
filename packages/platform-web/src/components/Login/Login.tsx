import './Login.scss';
import {Button, Grid, IconButton, makeStyles, Tooltip, Typography} from "@material-ui/core";
import LoginBackground from "./LoginBackground";
import {Power, Settings} from "@material-ui/icons";
import {showSettings} from '../../redux/actions/settings';
import {showConnectWallet} from '../../redux/actions/connectWallet';
import {useDispatch} from "react-redux";
import {commonStyles} from "../../utils/styles";

const useStyles = makeStyles({
    ...commonStyles,
    loginButton: {
        marginTop: 15,
    }
});


function Login(): JSX.Element {
    const classes = useStyles();
    const dispatch = useDispatch();

  return (
      <div className="login-wrapper">
          <div className="login-container">
              <Grid container>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <div className="left-section">
                        <LoginBackground></LoginBackground>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <div className="right-section">
                          <div>
                              <Tooltip title="Settings">
                                  <IconButton
                                      className="settings-button"
                                      onClick={() => {
                                          dispatch(showSettings());
                                      }}>
                                      <Settings></Settings>
                                  </IconButton>
                              </Tooltip>
                          </div>
                          <div className="logo">
                              Algodesk.io
                          </div>
                          <div>
                              <Button
                                  color={"primary"}
                                  variant={"contained"}
                                  size={"large"}
                                  className={classes.loginButton + ' ' + classes.blackButton}
                                  startIcon={<Power></Power>}
                                  onClick={() => {
                                      dispatch(showConnectWallet());
                                  }}
                              >Connect Wallet</Button>
                          </div>
                          <Typography variant="caption" display="block" gutterBottom color="textSecondary">
                              Powered by algorand
                          </Typography>
                      </div>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Login;
