import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import Funds from "../Funds/Funds";

function Dashboard(): JSX.Element {
  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Switch>
                  <Route path="/portal/dashboard/funds">
                      <Funds></Funds>
                  </Route>
                  <Route path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/funds" />} />
              </Switch>
          </div>
      </div>
  );
}

export default Dashboard;
