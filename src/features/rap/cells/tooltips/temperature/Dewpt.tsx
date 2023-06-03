import { useAppSelector } from "../../../../../hooks";
import { cToF } from "../../../../weather/aviation/DetailedAviationReport";
import { TemperatureUnit } from "../../../extra/settings/settingEnums";

interface DewptProps {
  inCelsius: number;
}

export default function Dewpt({ inCelsius }: DewptProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const dewpt = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return inCelsius;
      case TemperatureUnit.Fahrenheit:
        return cToF(inCelsius);
    }
  })();

  const temperatureUnitLabel = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return "C";
      case TemperatureUnit.Fahrenheit:
        return "F";
    }
  })();

  return (
    <>
      <td>{(Math.round(dewpt * 10) / 10).toFixed(1)}</td>
      <td>°{temperatureUnitLabel}</td>
    </>
  );
}
