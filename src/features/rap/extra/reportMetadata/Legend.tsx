import styled from "@emotion/styled";
import { outputP3ColorFromRGB } from "../../../../helpers/colors";
import PlaneSvg from "./plane.svg?react";

const Container = styled.div`
  padding: 0.5rem 1rem 0;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8em;
`;

const YourLocation = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  ${outputP3ColorFromRGB([0, 255, 0], "background")}
`;

const WindsAloft = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
  background: rgba(50, 0, 255, 0.3);
  border: 2px solid rgb(50, 0, 255);
`;

const NWS = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 2px;
  border: 2px solid;
  background: rgba(255, 0, 0, 0.3);
  ${outputP3ColorFromRGB([255, 0, 0], "border-color")}
`;

const StyledPlaneSvg = styled(PlaneSvg)`
  ${outputP3ColorFromRGB([255, 180, 0])}
  width: 1rem;
`;

interface LegendProps {
  showTaf: boolean;
  showNws: boolean;
  showOp40: boolean;
}

export default function Legend({ showTaf, showNws, showOp40 }: LegendProps) {
  return (
    <Container>
      <LegendItem>
        <YourLocation />
        Selected location
      </LegendItem>
      {showOp40 && (
        <LegendItem>
          <WindsAloft />
          Op40 Winds Aloft Gridpoint (approx)
        </LegendItem>
      )}
      {showNws && (
        <LegendItem>
          <NWS />
          NWS Hourly Forecast Gridpoint
        </LegendItem>
      )}
      {showTaf && (
        <LegendItem>
          <StyledPlaneSvg />
          Terminal Aerodrome Forecast (TAF) location
        </LegendItem>
      )}
    </Container>
  );
}
