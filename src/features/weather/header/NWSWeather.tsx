import lowerCase from "lodash/lowerCase";
import capitalize from "lodash/capitalize";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCloudHail,
  faCloudRain,
  faCloudSleet,
  faFog,
  faPooStorm,
  faRaindrops,
  faSmoke,
  faThunderstorm,
  faWind,
} from "@fortawesome/pro-duotone-svg-icons";
import { faSnowflake } from "@fortawesome/pro-light-svg-icons";
import { NWSWeatherObservation } from "../../../services/nwsWeather";
import { WeatherIcon } from "./Weather";
import styled from "@emotion/styled";
import Tooltip from "../../../shared/Tooltip";

const Flex = styled.div`
  display: flex;
`;

interface NWSWeatherProps {
  observations: NWSWeatherObservation[];
}

export default function NWSWeather({ observations }: NWSWeatherProps) {
  const observation: NWSWeatherObservation | undefined =
    observations.find(({ weather }) => weather === "thunderstorms") ||
    observations[0];

  if (!observation) return <></>;

  function renderTooltip() {
    return capitalize(
      observations
        .map((observation) =>
          [observation.coverage, observation.weather].map(lowerCase).join(" "),
        )
        .join(", "),
    );
  }

  const icon = findIconFor(observation);

  if (!icon) return <></>;

  return (
    <Tooltip contents={renderTooltip}>
      <Flex>
        <WeatherIcon
          icon={icon}
          lightning={
            observation.coverage !== "chance" &&
            observation.coverage !== "slight_chance"
          }
        />
      </Flex>
    </Tooltip>
  );
}

function findIconFor(observation: NWSWeatherObservation): IconProp | undefined {
  switch (observation.weather) {
    case "drizzle":
      return faRaindrops;
    case "dust":
    case "sand":
    case "sand_storm":
    case "volcanic_ash":
    case "unknown":
      return;
    case "dust_storm":
    case "dust_whirls":
      return faWind;
    case "fog":
    case "fog_mist":
    case "haze":
      return faFog;
    case "funnel_cloud":
      return faPooStorm;
    case "hail":
      return faCloudHail;
    case "ice_crystals":
    case "ice_pellets":
      return faCloudSleet;
    case "rain":
    case "spray":
    case "rain_showers":
      return faCloudRain;
    case "smoke":
      return faSmoke;
    case "snow":
    case "snow_grains":
    case "snow_pellets":
    case "snow_showers":
      return faSnowflake;
    case "squalls":
      return faWind;
    case "thunderstorms":
      return faThunderstorm;
  }
}
