import './Login.scss';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import {Power, Lock} from "@material-ui/icons";
import {showConnectWallet} from '../../redux/actions/connectWallet';
import {useDispatch, useSelector} from "react-redux";
import {getCommonStyles} from "../../utils/styles";
import {RootState} from "../../redux/store";
import {Redirect} from "react-router-dom";
import Logo from "../Logo/Logo";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        loginButton: {
            marginTop: 10,
            background: '#000',
            color: '#fff',
            '&:hover': {
                background: '#000'
            }
        }
    };
});


function Login(): JSX.Element {
    const classes = useStyles();
    const dispatch = useDispatch();

    const account = useSelector((state: RootState) => state.account);
    if (account.loggedIn) {
        return (<Redirect to='/portal'></Redirect>);
    }

  return (
      <div className="login-wrapper">
          <div className="login-container">
              <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <div className="login-form">
                          <div className="lock-icon">
                              <Lock></Lock>
                          </div>
                          <div className="logo">
                              <Logo></Logo>
                          </div>
                          <div className="login-button">
                              <Button
                                  variant={"contained"}
                                  size={"large"}
                                  className={classes.loginButton}
                                  startIcon={<Power></Power>}
                                  onClick={() => {
                                      dispatch(showConnectWallet());
                                  }}
                              >Connect Wallet</Button>
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
