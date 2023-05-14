import { IWind } from "metar-taf-parser";
import WindIndicator from "../../../rap/WindIndicator";
import { formatWind } from "../../../../helpers/taf";
import { useAppSelector } from "../../../../hooks";

interface WindProps {
  wind: IWind;
}

export default function Wind({ wind }: WindProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);

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
          at {formatWind(wind.speed, wind.unit, speedUnit)}{" "}
        </>
      ) : (
        <>Calm</>
      )}{" "}
      {wind.gust != null && (
        <>
          <br />
          Gusting to {formatWind(wind.gust, wind.unit, speedUnit)}
        </>
      )}
    </>
  );
}
