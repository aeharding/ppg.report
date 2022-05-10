import ReportWatchdog from "../rap/ReportWatchdog";
import Hourly from "./hourly/Hourly";
import Summary from "./summary/Summary";

export function Outlook() {
  return (
    <>
      <Summary />
      <Hourly />
      <ReportWatchdog />
    </>
  );
}
