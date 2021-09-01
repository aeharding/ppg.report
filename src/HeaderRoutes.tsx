import React from "react";
import { Switch, Route } from "react-router-dom";
import ReportHeader from "./header/ReportHeader";

export default function HeaderRoutes() {
  return (
    <Switch>
      <Route path="/:lat,:lon" component={ReportHeader} />
    </Switch>
  );
}
