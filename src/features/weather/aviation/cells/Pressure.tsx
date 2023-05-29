import { AltimeterUnit, IAltimeter } from "metar-taf-parser";

interface PressureProps {
  altimeter: IAltimeter;
}

export default function Temperature({ altimeter }: PressureProps) {
  const pressureLabel = (() => {
    switch (altimeter.unit) {
      case AltimeterUnit.HPa:
        return "mb";
      case AltimeterUnit.InHg:
        return "inches Hg";
    }
  })();

  return (
    <>
      {altimeter.value} {pressureLabel}
    </>
  );
}
