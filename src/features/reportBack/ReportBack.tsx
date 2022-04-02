import styled from "@emotion/styled/macro";
import { isWithinInterval } from "../../helpers/date";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getTrimmedCoordinates } from "../../helpers/coordinates";
import { useAppSelector } from "../../hooks";
import Alerts from "./Alerts";

const Container = styled.div`
  position: absolute;
  inset: 0;
  overflow: auto;

  padding: 0.5rem;
`;

interface ReportBackProps {
  date: string;
}

export default function ReportBack({ date }: ReportBackProps) {
  const { lat, lon } = useParams<"lat" | "lon">();
  if (!lat || !lon) throw new Error("lat and lon should be defined");

  const alerts = useAppSelector(
    (state) =>
      state.weather.alertsByCoordinates[getTrimmedCoordinates(+lat, +lon)]
  );

  const relevantAlerts = useMemo(
    () =>
      typeof alerts === "object"
        ? alerts.features.filter((alert) =>
            isWithinInterval(new Date(date), {
              start: new Date(alert.properties.onset),
              end: new Date(alert.properties.ends),
            })
          )
        : undefined,
    [alerts, date]
  );

  return (
    <Container>
      <a
        href={`https://www.windalert.com/windlist/${lat},${lon}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WindAlert.com
      </a>
      <a
        href={`https://www.windfinder.com/#10/${lat}/${lon}/${date}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WindFinder.com
      </a>

      {relevantAlerts?.length ? <Alerts alerts={relevantAlerts} /> : ""}
    </Container>
  );
}
