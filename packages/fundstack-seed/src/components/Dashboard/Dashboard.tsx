import './Dashboard.scss';
import {Redirect, Route, Switch} from "react-router-dom";
import Pools from "../Pools/Pools";

function Dashboard(): JSX.Element {
  return (
      <div className="dashboard-wrapper">
          <div className="dashboard-container">
              <Switch>
                  <Route path="/portal/dashboard/pools">
                      <Pools></Pools>
                  </Route>
                  <Route path="/portal/dashboard" render={() => <Redirect to="/portal/dashboard/pools" />} />
              </Switch>
          </div>
      </div>
  );
}

export default Dashboard;
