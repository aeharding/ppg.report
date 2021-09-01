import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import chroma from "chroma-js";

export const headerText = css`
  text-transform: uppercase;
  font-size: 0.7em;
  color: rgba(255, 255, 255, 0.8);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  margin: 3px 0;

  h4 {
    margin: 0 5px;
    display: inline;

    ${headerText}
  }
`;

const cinColorScale = chroma
  .scale(["white", "yellow", "red"])
  .domain([0, -38, -90]);

const Cin = styled.div<{ cin: number }>`
  color: ${({ cin }) => cinColorScale(cin).css()};
`;

const capeColorScale = chroma
  .scale(["white", "yellow", "red"])
  .domain([0, 1750, 5000, 95]);

const Cape = styled.div<{ cape: number }>`
  color: ${({ cape }) => capeColorScale(cape).css()};
`;

interface CinCapeProps {
  cin: number;
  cape: number;
}

export default function CinCape({ cin, cape }: CinCapeProps) {
  return (
    <Container>
      <Cin
        cin={cin}
        title="CIN values between 0 and -25 are classified as weak inhibition. CIN values between -25 and -50, typically qualify as moderate. When you see CIN values of -100, you have a chance of a very large storm!"
      >
        <h4>CIN</h4>
        {cin}
      </Cin>
      <Cape
        cape={cape}
        title="CAPE is directly related to the maximum potential vertical speed within an updraft; thus, higher values indicate greater potential for severe weather. On average, 1000 is usually sufficient for strong to severe storms. CAPE of 3,000 to 4,000, or higher, is usually a signal of a very volatile atmosphere that could produce severe storms."
      >
        <h4>CAPE</h4>
        {cape}
      </Cape>
    </Container>
  );
}
