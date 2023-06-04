import { useAppSelector } from "../../../../../hooks";
import { TemperatureUnit } from "../../../extra/settings/settingEnums";

interface SpreadProps {
  inCelsius: number;
}

export default function Spread({ inCelsius }: SpreadProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const spread = (() => {
    switch (temperatureUnit) {
      case TemperatureUnit.Celsius:
        return inCelsius;
      case TemperatureUnit.Fahrenheit:
        return deltaCToDeltaF(inCelsius);
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
      <td>{(Math.round(Math.abs(spread) * 10) / 10).toFixed(1)}</td>
      <td>°{temperatureUnitLabel} Δ</td>
    </>
  );
}

export function deltaCToDeltaF(celsius: number): number {
  return (celsius * 9) / 5;
}
