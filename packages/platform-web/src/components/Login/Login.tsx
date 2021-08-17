import './Login.scss';
import {Button, Grid, makeStyles, Typography} from "@material-ui/core";
import LoginBackground from "./background";
import {Power} from "@material-ui/icons";

const useStyles = makeStyles({
    loginButton: {
        marginTop: 15,
    },
    blackButton: {
        background: '#000',
        '&:hover': {
            background: '#000 !important',
        },
        '&:focus': {
            background: '#000 !important',
        }
    }
});

function Login(): JSX.Element {
    const classes = useStyles();

  return (
      <div className="login-wrapper">
          <div className="login-container">
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <div className="left-section">
                        <LoginBackground></LoginBackground>
                      </div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <div className="right-section">
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
