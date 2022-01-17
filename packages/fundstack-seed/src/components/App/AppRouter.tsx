import {Redirect, Route, Switch} from "react-router-dom";
import Portal from "../Portal/Portal";
import React from "react";
import Login from "../Login/Login";

function AppRouter(): JSX.Element {
    return (<div>
        <Switch>
            <Route path="/portal">
                <Portal></Portal>
            </Route>
            <Route path="/login">
                <Login></Login>
            </Route>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    </div>);
}

export default AppRouter;
