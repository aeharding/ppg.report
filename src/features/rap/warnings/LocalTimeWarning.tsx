import styled from "@emotion/styled";
import { faClock } from "@fortawesome/pro-light-svg-icons";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import { Container, Icon, WarningMessage } from "./styles";

const StyledWarningMessage = styled(WarningMessage)`
  ${outputP3ColorFromRGB([255, 200, 0])}
`;

export default function ReportStale() {
  const usingLocalTime = useAppSelector(
    (state) => state.weather.usingLocalTime,
  );

  if (!usingLocalTime) return <></>;

  return (
    <Container>
      <StyledWarningMessage>
        <Icon icon={faClock} />
        <div>
          <strong>Notice</strong> The timezone API is down. All times are
          represented using your local system time.
        </div>
      </StyledWarningMessage>
    </Container>
  );
}
