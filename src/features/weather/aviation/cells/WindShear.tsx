import { IWindShear } from "metar-taf-parser";
import { useAppSelector } from "../../../../hooks";
import WindIndicator from "../../../rap/WindIndicator";
import { formatHeight, formatWind } from "../../../../helpers/taf";

interface WindShearProps {
  windShear: IWindShear;
}

export default function WindShear({ windShear }: WindShearProps) {
  const speedUnit = useAppSelector((state) => state.user.speedUnit);
  const heightUnit = useAppSelector((state) => state.user.heightUnit);

  return (
    <>
      {windShear.degrees ? (
        <>
          {windShear.degrees} <WindIndicator direction={windShear.degrees} />{" "}
          at{" "}
        </>
      ) : (
        "Variable direction at"
      )}{" "}
      {formatWind(windShear.speed, windShear.unit, speedUnit)}{" "}
      {windShear.gust != null ? (
        <>gusting to {formatWind(windShear.gust, windShear.unit, speedUnit)}</>
      ) : (
        ""
      )}{" "}
      at {formatHeight(windShear.height, heightUnit)} AGL
    </>
  );
}
