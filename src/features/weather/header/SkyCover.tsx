import styled from "@emotion/styled/macro";
import { faClouds, faCloud } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import chroma from "chroma-js";
import { useMemo } from "react";
import { outputP3ColorFromRGBA } from "../../../helpers/colors";
import { findValue } from "../../../services/weather";
import { HeaderType, Micro } from "../WeatherHeader";
import { WeatherResult } from "../weatherSlice";

const colorScale = chroma.scale(["#ffffff44", "#ffffffff"]).domain([20, 80]);
const colorScaleDanger = chroma
  .scale(["#ff000044", "#ff0000ff"])
  .domain([20, 80]);
const colorScaleWarning = chroma
  .scale(["#ff000044", "#ff0000ff"])
  .domain([20, 80]);

function getScale(header: HeaderType): chroma.Scale {
  switch (header) {
    case HeaderType.Normal:
      return colorScale;
    case HeaderType.Danger:
      return colorScaleDanger;
    case HeaderType.Warning:
      return colorScaleWarning;
  }
}

const SkyIcon = styled(FontAwesomeIcon)<{ header: HeaderType; chance: number }>`
  ${({ header, chance }) =>
    outputP3ColorFromRGBA(getScale(header)(chance).rgba())}
`;

interface SkyCoverProps {
  date: string;
  header: HeaderType;
  weather: WeatherResult | undefined;
}

export default function SkyCover({ date, header, weather }: SkyCoverProps) {
  const chance = useMemo(
    () =>
      typeof weather === "object"
        ? findValue(
            new Date(date),

            weather.properties.skyCover
          )
        : undefined,
    [date, weather]
  );

  if (!chance) return <></>;

  const icon = (() => {
    if (chance?.value > 75) return faClouds;
    return faCloud;
  })();

  const body = <>{chance.value}%</>;

  return (
    <Tippy content={`${chance.value}% sky cover`} placement="bottom">
      <div>
        <Micro
          icon={<SkyIcon header={header} icon={icon} chance={chance.value} />}
        >
          {body}
        </Micro>
      </div>
    </Tippy>
  );
}
