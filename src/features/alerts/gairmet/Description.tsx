import { GAirmetFeature } from "../../../services/aviationWeather";
import { capitalizeFirstLetter } from "../../../helpers/string";
import { formatSeverity } from "../../../helpers/aviationAlerts";
import React from "react";
import omit from "lodash/omit";
import styled from "@emotion/styled";
import { getAlertEnd, getAlertStart } from "../alertsSlice";
import { useAppSelector } from "../../../hooks";
import { timeZoneSelector } from "../../weather/weatherSlice";
import isEqual from "lodash/isEqual";
import { format } from "date-fns";
import { TZDate } from "@date-fns/tz";

const Label = styled.div`
  margin: 1rem 0 -1rem;
  font-size: 0.8rem;
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
    switch (alert.properties.hazard) {
      case "TURB-LO":
      case "TURB-HI":
        return (
          <p>
            {alert.properties.severity
              ? capitalizeFirstLetter(
                  formatSeverity(alert.properties.severity)!,
                )
              : ""}{" "}
            non-convective turbulence exists in the{" "}
            {alert.properties.hazard === "TURB-HI" ? "upper" : "lower"}{" "}
            atmosphere{" "}
            {alert.properties.base && alert.properties.top
              ? `(${formatFlightLevel(
                  alert.properties.base,
                )} to ${formatFlightLevel(alert.properties.top!)})`
              : ""}
            .
          </p>
        );
      case "LLWS":
        return (
          <p>
            Non-convective wind shear below 2,000 feet AGL, resulting in an air
            speed loss or gain of 20 knots or more.
          </p>
        );
      case "SFC_WND":
        return <p>AIR SPEED LOSS OR GAIN OF 30KTS OR MORE BELOW 2000 FT AGL</p>;
      case "ICE":
        return (
          <p>
            {alert.properties.base === "FZL" ? (
              <>
                Freezing level between{" "}
                {formatFlightLevel(alert.properties.fzlbase!)} and{" "}
                {formatFlightLevel(alert.properties.fzltop!)}.
              </>
            ) : (
              ""
            )}{" "}
            {capitalizeFirstLetter(
              [formatSeverity(alert.properties.severity), "icing"]
                .filter((n) => n)
                .join(" "),
            )}{" "}
            from{" "}
            {alert.properties.base === "FZL"
              ? "freezing level"
              : formatFlightLevel(alert.properties.base!)}{" "}
            to {formatFlightLevel(alert.properties.top!)}.
          </p>
        );
      case "M_FZLVL":
        return (
          <p>
            Multiple freezing levels
            {alert.properties.base && alert.properties.top ? (
              <>
                {" "}
                from {formatFlightLevel(alert.properties.base)} to{" "}
                {formatFlightLevel(alert.properties.top)}
              </>
            ) : (
              ""
            )}
            .
          </p>
        );
    }

    if (alert.properties.dueTo) return <p>{alert.properties.dueTo}</p>;
  }

  const items = alerts.reduce<GAirmetFeature[][]>((prev, curr) => {
    if (prev.length && hasSimilarData(curr, prev[prev.length - 1][0])) {
      prev[prev.length - 1].push(curr);
    } else {
      prev.push([curr]);
    }
    return prev;
  }, []);

  function hasSimilarData(a: GAirmetFeature, b: GAirmetFeature): boolean {
    const simplify = (alert: GAirmetFeature) =>
      omit(alert.properties, "issueTime", "forecast", "validTime");

    return isEqual(simplify(a), simplify(b));
  }

  if (items.length < 2) return <>{renderAlertDescription(items[0][0])}</>;

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item[0].id}>
          <Label>
            From {format(new TZDate(getAlertStart(item[0]), timeZone), "haaa")}–
            {format(
              new TZDate(getAlertEnd(item[item.length - 1])!, timeZone),
              "haaa",
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
