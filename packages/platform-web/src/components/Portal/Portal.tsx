import './Portal.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Header from "../Header/Header";
import {Redirect, Route, Switch} from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

function Portal(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    if (!account.loggedIn) {
        return (<Redirect to='/login'></Redirect>);
    }

  return (
      <div className="portal-wrapper">
          <div className="portal-container">
            <Header></Header>
              <Switch>
                  <Route path="/portal/dashboard">
                      <Dashboard></Dashboard>
                  </Route>
                  <Route exact path="/portal" render={() => <Redirect to="/portal/dashboard" />} />
              </Switch>
          </div>
      </div>
  );
}

export default Portal;
