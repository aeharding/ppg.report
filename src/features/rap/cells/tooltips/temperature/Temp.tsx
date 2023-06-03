import { useAppSelector } from "../../../../../hooks";
import { cToF } from "../../../../weather/aviation/DetailedAviationReport";
import { TemperatureUnit } from "../../../extra/settings/settingEnums";
import { TemperatureText } from "../../Temperature";

interface TempProps {
  inCelsius: number;
}

export default function Temp({ inCelsius }: TempProps) {
  const temperatureUnit = useAppSelector((state) => state.user.temperatureUnit);

  const temperature = (() => {
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
      <TemperatureText as="td" temperature={inCelsius}>
        {(Math.round(temperature * 10) / 10).toFixed(1)}
      </TemperatureText>
      <TemperatureText as="td" temperature={inCelsius}>
        °{temperatureUnitLabel}
      </TemperatureText>
    </>
  );
}
