import './Portal.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import {Grid} from "@material-ui/core";
import {useSelector} from "react-redux";
import LeftBar from "../LeftBar/LeftBar";
import {RootState} from "../../redux/store";
import Dashboard from "../Dashboard/Dashboard";

function Portal(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    if (!account.loggedIn) {
        return (<Redirect to='/login'></Redirect>);
    }

  return (
      <div className="portal-wrapper">
          <div className="portal-container">
              <Grid container spacing={0}>
                  <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                      <LeftBar></LeftBar>
                  </Grid>
                  <Grid item xs={12} sm={12} md={9} lg={10} xl={10}>
                      <Switch>
                          <Route path="/portal/dashboard">
                            <Dashboard></Dashboard>
                          </Route>
                          <Route exact path="/portal" render={() => <Redirect to="/portal/dashboard" />} />
                      </Switch>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Portal;
