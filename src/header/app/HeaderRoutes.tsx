import { Switch, Route } from "react-router-dom";
import ReportHeader from "./ReportHeader";
import HomeHeader from "./HomeHeader";

export default function HeaderRoutes() {
  return (
    <Switch>
      <Route path="/:lat,:lon" component={ReportHeader} />
      <Route path="/" component={HomeHeader} />
    </Switch>
  );
}
