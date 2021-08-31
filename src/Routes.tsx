import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Report from "./routes/Report";

export default function Routes() {
  return (
    <Switch>
      <Route path="/:lat(\d+),:lon(\d+)" component={Report} />
      <Route path="/" exact>
        <Home />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
