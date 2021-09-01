import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Terms from "./routes/Terms";
import Report from "./routes/Report";

export default function Routes() {
  return (
    <Switch>
      <Route path="/:lat,:lon" component={Report} />
      <Route path="/terms" exact>
        <Terms />
      </Route>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
