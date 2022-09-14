import styled from "@emotion/styled/macro";
import { faClock } from "@fortawesome/pro-light-svg-icons";
import { differenceInHours } from "date-fns";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import { Container, Icon, WarningMessage } from "./styles";

const StyledWarningMessage = styled(WarningMessage)`
  ${outputP3ColorFromRGB([255, 200, 0])}
`;

export default function ReportStale() {
  const rap = useAppSelector((state) => state.rap.rap);

  if (!rap || typeof rap !== "object") return <></>;

  const difference = differenceInHours(new Date(), new Date(rap[0].date));

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
