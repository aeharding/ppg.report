import { IWind } from "metar-taf-parser";
import WindIndicator from "../../../rap/WindIndicator";
import { convertSpeedToKph } from "../../../../helpers/taf";
import { useAppSelector } from "../../../../hooks";
import { formatSpeed } from "../../header/Wind";
import { speedUnitFormatter } from "../../../rap/cells/WindSpeed";

interface WindProps {
  wind: IWind;
}

export default function Wind({ wind }: WindProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const speedUnitLabel = speedUnitFormatter(speedUnit);

  const windSpeedLocalized = Math.round(
    formatSpeed(convertSpeedToKph(wind.speed, wind.unit), speedUnit)
  );
  const gustSpeedLocalized = Math.round(
    formatSpeed(convertSpeedToKph(wind.gust ?? 0, wind.unit), speedUnit)
  );

  return (
    <>
      {wind.speed && wind.direction ? (
        <>
          {wind.degrees != null ? (
            <>
              {wind.degrees} <WindIndicator direction={wind.degrees} />
            </>
          ) : (
            "Variable"
          )}{" "}
          at {windSpeedLocalized} {speedUnitLabel}{" "}
        </>
      ) : (
        <>Calm</>
      )}{" "}
      {wind.gust != null && (
        <>
          <br />
          Gusting to {gustSpeedLocalized} {speedUnitLabel}
        </>
      )}
    </>
  );
}
