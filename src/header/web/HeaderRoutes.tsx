import { Switch, Route } from "react-router-dom";
import ReportHeader from "./ReportHeader";

export default function HeaderRoutes() {
  return (
    <Switch>
      <Route path="/:lat,:lon" component={ReportHeader} />
    </Switch>
  );
}
