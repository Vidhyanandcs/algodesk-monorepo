import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import {Grid} from '@material-ui/core';
import Assets from "../Assets/Assets";

function Dashboard(): JSX.Element {

  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                  </Grid>
                  <Grid item xs={10} sm={8} md={8} lg={8} xl={8}>
                      <div className={"dashboard-body"}>
                          <Switch>
                              <Route path="/portal/dashboard/assets">
                                  <Assets></Assets>
                              </Route>
                              <Route exact path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/assets" />} />
                          </Switch>
                      </div>
                  </Grid>
                  <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Dashboard;
