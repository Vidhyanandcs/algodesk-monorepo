import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";

function Dashboard(): JSX.Element {
  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Switch>
                  <Route exact path="/portal/dashboard/funds">
                      Funds
                  </Route>
                  <Route path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/funds" />} />
              </Switch>
          </div>
      </div>
  );
}

export default Dashboard;
