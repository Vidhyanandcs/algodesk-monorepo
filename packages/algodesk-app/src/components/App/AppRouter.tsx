import {Redirect, Route, Switch} from "react-router-dom";
import Login from "../Login/Login";
import Portal from "../Portal/Portal";
import React from "react";

function AppRouter(): JSX.Element {
    return (<div>
        <Switch>
            <Route path="/login">
                <Login></Login>
            </Route>
            <Route path="/portal">
                <Portal></Portal>
            </Route>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
    </div>);
}

export default AppRouter;
