interface HumidityProps {
  temperature: number;
  dewPoint: number;
}

export default function Humidity({ temperature, dewPoint }: HumidityProps) {
  return <>RH = {Math.round(getRh(temperature, dewPoint))}%</>;
}

// from https://www.weather.gov/mfl/calculator
function getRh(airTemp: number, dewPoint: number) {
  var tc = airTemp;
  var tdc = dewPoint;

  return 100.0 * Math.pow((112 - 0.1 * tc + tdc) / (112 + 0.9 * tc), 8);
}
