import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Routes } from "./routes";
import PrivateRouter from "./privateRouter";

import { NotFound, Login, Home } from "./../screens";
import Players from "../screens/players";

const RouterApp = (props) => {
  return (
    <Router>
      <Switch>
        {/* Login Route */}
        <Route exact path={Routes.home}>
          <Home />
        </Route>
        <Route exact path={Routes.players} component={Players} />

        {/* For unknow/non-defined path */}
        <Route exact path="*" component={NotFound} />

      </Switch>
    </Router>
  );
};

export default RouterApp;
