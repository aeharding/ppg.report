import styled from "@emotion/styled";
import { faClock } from "@fortawesome/pro-light-svg-icons";
import { differenceInHours } from "date-fns";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import { Container, Icon, WarningMessage } from "./styles";

const StyledWarningMessage = styled(WarningMessage)`
  ${outputP3ColorFromRGB([255, 200, 0])}
`;

export default function ReportStale() {
  const windsAloft = useAppSelector((state) => state.weather.windsAloft);

  if (!windsAloft || typeof windsAloft !== "object") return <></>;

  // Need to determine behavior for outdated open meteo data
  if (windsAloft.source !== "rucSounding") return <></>;

  const difference = differenceInHours(
    new Date(),
    new Date(windsAloft.hours[0].date),
  );

  if (difference < 4) return <></>;

  return (
    <Container>
      <StyledWarningMessage>
        <Icon icon={faClock} />
        <div>
          <strong>Notice</strong> Due to{" "}
          <a
            href="https://rucsoundings.noaa.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            upstream data issues
          </a>
          , winds aloft data is currently{" "}
          <strong>{difference} hours stale.</strong>
        </div>
      </StyledWarningMessage>
    </Container>
  );
}
