import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import {Grid} from '@material-ui/core';
import Assets from "../Assets/Assets";

function Dashboard(): JSX.Element {
  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      {/*<div className="dashboard-tabs">*/}
                      {/*    <Tabs*/}
                      {/*        value={"created_assets"}*/}
                      {/*        indicatorColor="primary"*/}
                      {/*        textColor="primary"*/}
                      {/*        variant="standard"*/}
                      {/*    >*/}
                      {/*        <Tab label={"Created Assets (" + createdAssets.length + ')'} value="created_assets"/>*/}
                      {/*    </Tabs>*/}
                      {/*</div>*/}
                      <div className={"dashboard-body"}>
                          <Switch>
                              <Route path="/portal/dashboard/assets">
                                  <Assets></Assets>
                              </Route>
                              <Route exact path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/assets" />} />
                          </Switch>
                      </div>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Dashboard;
