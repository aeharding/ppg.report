import { useAppSelector } from "../../../../hooks";
import { TemperatureUnit } from "../../../rap/extra/settings/settingEnums";
import { cToF } from "../DetailedAviationReport";

interface TemperatureProps {
  temperatureInC: number;
}

export default function Temperature({ temperatureInC }: TemperatureProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);
  const temperatureLabel = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "℃";
      case TemperatureUnit.Fahrenheit:
        return "℉";
    }
  })();

  const temperature = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return temperatureInC;
      case TemperatureUnit.Fahrenheit:
        return Math.round(cToF(temperatureInC));
    }
  })();

  return (
    <>
      {temperature} {temperatureLabel}
    </>
  );
}
