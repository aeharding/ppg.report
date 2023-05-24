import styled from "@emotion/styled";
import Tippy from "@tippyjs/react";
import capitalize from "lodash/capitalize";
import { WeatherIcon } from "./Weather";
import {
  faCloudRain,
  faFog,
  faThunderstorm,
} from "@fortawesome/pro-duotone-svg-icons";
import { faSnowflake } from "@fortawesome/pro-light-svg-icons";

const Flex = styled.div`
  display: flex;
`;

enum WMOWeatherCode {
  ClearSky = 0,
  MainlyClear = 1,
  PartlyCloudy = 2,
  Overcast = 3,
  FogRime = 45,
  DepositingRimeFog = 48,
  LightDrizzle = 51,
  ModerateDrizzle = 53,
  HeavyDrizzle = 55,
  LightRain = 61,
  ModerateRain = 63,
  HeavyRain = 65,
  LightFreezingRain = 66,
  HeavyFreezingRain = 67,
  SnowGrains = 77,
  LightRainShowers = 80,
  ModerateRainShowers = 81,
  HeavyRainShowers = 82,
  LightSnowShowers = 85,
  HeavySnowShowers = 86,
  LightOrModerateThunderstorms = 95,
  ThunderstormWithLightHail = 96,
  ThunderstormWithHeavyHail = 99,
}

interface WMOWeatherCodeProps {
  wmoCode: WMOWeatherCode;
}

export default function WMOWeather({ wmoCode }: WMOWeatherCodeProps) {
  let tooltip = capitalize(WMOWeatherCode[wmoCode]);

  const icon = (() => {
    switch (wmoCode) {
      case WMOWeatherCode.LightRainShowers:
      case WMOWeatherCode.ModerateRainShowers:
      case WMOWeatherCode.HeavyRainShowers:
      case WMOWeatherCode.LightRain:
      case WMOWeatherCode.ModerateRain:
      case WMOWeatherCode.HeavyRain:
      case WMOWeatherCode.LightDrizzle:
      case WMOWeatherCode.ModerateDrizzle:
      case WMOWeatherCode.HeavyDrizzle:
        return faCloudRain;
      case WMOWeatherCode.SnowGrains:
      case WMOWeatherCode.LightSnowShowers:
      case WMOWeatherCode.HeavySnowShowers:
        return faSnowflake;
      case WMOWeatherCode.ThunderstormWithHeavyHail:
      case WMOWeatherCode.ThunderstormWithLightHail:
      case WMOWeatherCode.LightOrModerateThunderstorms:
        return faThunderstorm;
      case WMOWeatherCode.FogRime:
      case WMOWeatherCode.DepositingRimeFog:
        return faFog;
    }
  })();

  if (!icon) return <></>;

  return (
    <Tippy content={tooltip} placement="bottom">
      <Flex>
        <WeatherIcon
          icon={icon}
          lightning={
            wmoCode === WMOWeatherCode.ThunderstormWithHeavyHail ||
            wmoCode === WMOWeatherCode.ThunderstormWithLightHail ||
            wmoCode === WMOWeatherCode.LightOrModerateThunderstorms
          }
        />
      </Flex>
    </Tippy>
  );
}
