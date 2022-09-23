import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import React, { useMemo } from "react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { useAppSelector } from "../../../hooks";
import { findValue } from "../../../services/weather";

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

const DisagreeIcon = styled(FontAwesomeIcon)`
  ${outputP3ColorFromRGB([255, 255, 0])}
`;

const WindGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
`;

interface WindDirectionProps {
  curr: number;
  prev?: number;
  date: string;
}

export default function WindDirection({
  curr,
  prev,
  date,
}: WindDirectionProps) {
  const weather = useAppSelector((state) => state.weather.weather);
  const wind = useMemo(
    () =>
      typeof weather === "object"
        ? {
            direction: findValue(
              new Date(date),
              weather.properties.windDirection
            ),
          }
        : undefined,
    [date, weather]
  );

  const modelDisagreement =
    wind?.direction?.value != null &&
    prev == null &&
    Math.abs(getAngleDifference(wind.direction.value, curr)) > 60;

  function wrapWithTooltipIfNeeded(children: React.ReactNode) {
    if (!modelDisagreement) return <>{children}</>;

    return (
      <Tippy
        placement="bottom"
        content={
          modelDisagreement ? (
            <>
              Models disagree on surface wind direction
              <WindGrid>
                <div>Winds aloft model</div>
                <div>
                  {curr}{" "}
                  <TransformedIcon icon={faLongArrowDown} direction={curr} />
                </div>
                <div>NWS prediction model</div>
                <div>
                  {wind!.direction!.value}{" "}
                  <TransformedIcon
                    icon={faLongArrowDown}
                    direction={wind!.direction!.value}
                  />
                </div>
              </WindGrid>
            </>
          ) : undefined
        }
      >
        <div>{children}</div>
      </Tippy>
    );
  }

  const content = useMemo(
    () =>
      wrapWithTooltipIfNeeded(
        <Container
          shear={
            Math.abs(
              getAngleDifference(curr, prev === undefined ? curr : prev)
            ) > 25
          }
        >
          {modelDisagreement ? (
            <DisagreeIcon icon={faExclamationTriangle} />
          ) : (
            ""
          )}{" "}
          {curr} <TransformedIcon icon={faLongArrowDown} direction={curr} />{" "}
        </Container>
      ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [curr, prev, wind]
  );

  return content;
}

function getAngleDifference(angle1: number, angle2: number): number {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}
