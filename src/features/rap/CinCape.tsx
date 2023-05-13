import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { outputP3ColorFromLab } from "../../helpers/colors";

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

  > *:not(:last-of-type) {
    margin-right: 5px;
  }

  h4 {
    margin: 0 5px;
    display: inline;

    ${headerText}
  }
`;

const Description = styled.div`
  p {
    &:first-of-type {
      margin-top: 0;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const cinColorScale = chroma
  .scale(["white", "white", "yellow", "red"])
  .domain([0, -20, -50, -90]);

const Cin = styled.span<{ cin: number }>`
  ${({ cin }) => outputP3ColorFromLab(cinColorScale(cin).lab())};
`;

const capeColorScale = chroma
  .scale(["white", "yellow", "red"])
  .domain([0, 1250, 3000]);

const Cape = styled.span<{ cape: number }>`
  ${({ cape }) => outputP3ColorFromLab(capeColorScale(cape).lab())};
`;

interface CinCapeProps {
  cin: number;
  cape: number;
}

export default function CinCape({ cin, cape }: CinCapeProps) {
  return (
    <Container>
      <Tippy
        content={
          <Description>
            <p>
              <a
                href="https://en.wikipedia.org/wiki/Convective_inhibition"
                target="_blank"
                rel="noreferrer noopener"
              >
                CIn (Convective inhibition)
              </a>{" "}
              in J/Kg. We use the most unstable CIN (MUCIN) using the parcel
              with highest theta-e in lowest 300 mb.
            </p>
            <p>
              CIN values between <Cin cin={0}>0</Cin> and{" "}
              <Cin cin={-25}>-25</Cin> are classified as weak inhibition.
            </p>{" "}
            <p>
              CIN values between <Cin cin={-25}>-25</Cin> and{" "}
              <Cin cin={-50}>-50</Cin>, typically qualify as moderate. When you
              see CIN values of <Cin cin={-100}>-100</Cin>, you have a chance of
              a very large storm!
            </p>
          </Description>
        }
        interactive
        placement="bottom"
      >
        <Cin cin={cin}>
          <h4>CIN</h4>
          {cin}
        </Cin>
      </Tippy>
      <Tippy
        content={
          <Description>
            <p>
              <a
                href="https://en.wikipedia.org/wiki/Convective_available_potential_energy"
                target="_blank"
                rel="noreferrer noopener"
              >
                CAPE (Convective Available Potential Energy)
              </a>{" "}
              in J/Kg. We use the most <strong>unstable CAPE (MUCAPE)</strong>{" "}
              using the parcel with highest theta-e in lowest 300 mb.
            </p>
            <p>
              CAPE is directly related to the maximum potential vertical speed
              within an updraft; thus, higher values indicate greater potential
              for severe weather.
            </p>
            <p>
              On average, <Cape cape={1000}>1,000</Cape> is usually sufficient
              for strong to severe storms.
            </p>
            <p>
              CAPE of <Cape cape={3000}>3,000</Cape> to{" "}
              <Cape cape={4000}>4,000</Cape>, or higher, is usually a signal of
              a very volatile atmosphere that could produce severe storms.
            </p>
          </Description>
        }
        interactive
        placement="bottom"
      >
        <Cape cape={cape}>
          <h4>CAPE</h4>
          {cape}
        </Cape>
      </Tippy>
    </Container>
  );
}
