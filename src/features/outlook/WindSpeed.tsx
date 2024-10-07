import styled from "@emotion/styled";
import { formatWind } from "../../helpers/taf";
import { useAppSelector } from "../../hooks";
import { SpeedUnit } from "metar-taf-parser";
import { toMph, WindIcon } from "../weather/header/Wind";
import { HeaderType } from "../weather/WeatherHeader";
import { faWindsock } from "@fortawesome/pro-duotone-svg-icons";

const Speed = styled.div`
  word-spacing: -2px;
`;

const StyledWindIcon = styled(WindIcon)`
  margin-right: 12px;
`;
interface WindSpeedProps {
  speed: number;
  gust: number;
}

export default function WindSpeed({ speed, gust }: WindSpeedProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const speedFormatted = formatWind(
    speed,
    SpeedUnit.KilometersPerHour,
    speedUnit,
    false,
  );
  const gustFormatted = formatWind(
    gust,
    SpeedUnit.KilometersPerHour,
    speedUnit,
    false,
  );

  return (
    <>
      <Speed>
        <StyledWindIcon
          headerType={HeaderType.Normal}
          speed={Math.round(toMph(speed))}
          gust={Math.round(toMph(gust))}
          icon={faWindsock}
        />
        {speedFormatted}G{gustFormatted}
      </Speed>
    </>
  );
}
