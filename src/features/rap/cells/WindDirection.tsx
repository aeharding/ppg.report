import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";

export const shearIndicator = css`
  content: "";
  position: absolute;
  top: 0;
  left: -0.75em;
  right: -0.75em;
  transform: translateY(-2px);

  height: 1px;

  ${outputP3ColorFromRGB([255, 0, 0], "background")}

  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 25%,
    rgba(0, 0, 0, 1) 75%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const Container = styled.div<{ shear: boolean }>`
  position: relative;

  ${({ shear }) =>
    shear &&
    css`
      &:after {
        ${shearIndicator}
      }
    `}
`;

const TransformedIcon = styled(FontAwesomeIcon)<{ direction: number }>`
  transform: rotate(${({ direction }) => direction}deg);
`;

interface WindDirectionProps {
  curr: number;
  prev?: number;
}

export default function WindDirection({ curr, prev }: WindDirectionProps) {
  const content = useMemo(() => {
    return (
      <Container
        shear={
          Math.abs(getAngleDifference(curr, prev === undefined ? curr : prev)) >
          25
        }
      >
        {curr} <TransformedIcon icon={faLongArrowDown} direction={curr} />
      </Container>
    );
  }, [curr, prev]);

  return content;
}

function getAngleDifference(angle1: number, angle2: number): number {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}
