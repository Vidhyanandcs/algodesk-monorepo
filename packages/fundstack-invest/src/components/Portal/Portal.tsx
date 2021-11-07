import './Portal.scss';
import Header from "../Header/Header";
import {Redirect, Route, Switch} from "react-router-dom";
import {Grid} from "@material-ui/core";
import Fund from "../Fund/Fund";

function Portal(): JSX.Element {

  return (
      <div className="portal-wrapper">
          <div className="portal-container">
              <Header></Header>

              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      <Switch>
                          <Route exact path="/portal/home">
                              home
                          </Route>
                          <Route exact path="/portal/fund/:id">
                              <Fund></Fund>
                          </Route>
                          <Route exact path="/portal" render={() => <Redirect to="/portal/home" />} />
                      </Switch>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
              </Grid>


          </div>
      </div>
  );
}

export default Portal;