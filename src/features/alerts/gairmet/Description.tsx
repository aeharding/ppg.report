import { GAirmetFeature } from "../../../services/aviationWeather";
import { capitalizeFirstLetter } from "../../../helpers/string";
import { formatSeverity } from "../../../helpers/aviationAlerts";
import React from "react";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";
import styled from "@emotion/styled/macro";
import { getAlertEnd, getAlertStart } from "../alertsSlice";
import { formatInTimeZone } from "date-fns-tz";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../../weather/weatherSlice";

const Label = styled.div`
  margin: 1rem 0 -0.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
  text-transform: uppercase;
`;

interface DescriptionProps {
  alerts: GAirmetFeature[];
}

export default function Description({ alerts }: DescriptionProps) {
  const timeZone = useAppSelector(timeZoneSelector);

  if (!timeZone) throw new Error("timeZone not defined");

  function renderAlertDescription(alert: GAirmetFeature) {
    if (alert.properties.dueTo) return alert.properties.dueTo;

    switch (alert.properties.hazard) {
      case "TURB-LO":
      case "TURB-HI":
        return (
          <p>
            {alert.properties.severity
              ? capitalizeFirstLetter(
                  formatSeverity(alert.properties.severity)!
                )
              : ""}{" "}
            non-convective turbulence exists in the{" "}
            {alert.properties.hazard === "TURB-HI" ? "upper" : "lower"}{" "}
            atmosphere{" "}
            {alert.properties.base && alert.properties.top
              ? `(${formatFlightLevel(
                  alert.properties.base
                )} to ${formatFlightLevel(alert.properties.top!)})`
              : ""}
            .
          </p>
        );
      case "LLWS":
        return (
          <>
            <p>
              Non-convective wind shear below 2,000 feet AGL, resulting in an
              air speed loss or gain of 20 knots or more.
            </p>
          </>
        );
    }
  }

  const items = Object.values(
    groupBy(alerts, (alert) =>
      Object.values(
        omit(alert.properties, "issueTime", "forecast", "validTime")
      ).join("")
    )
  );

  if (items.length < 2) return <>{renderAlertDescription(items[0][0])}</>;

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item[0].id}>
          <Label>
            From {formatInTimeZone(getAlertStart(item[0]), timeZone, "haaa")}–
            {formatInTimeZone(
              getAlertEnd(item[item.length - 1])!,
              timeZone,
              "haaa"
            )}
          </Label>
          {renderAlertDescription(item[0])}
        </React.Fragment>
      ))}
    </>
  );
}

function formatFlightLevel(fl: string): string {
  if (fl === "SFC") return "surface";

  return `${(+fl * 100).toLocaleString()} MSL`;
}
