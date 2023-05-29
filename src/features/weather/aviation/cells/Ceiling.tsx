import { ICloud } from "metar-taf-parser";
import {
  determineCeilingFromClouds,
  formatHeight,
} from "../../../../helpers/taf";
import { useAppSelector } from "../../../../hooks";

interface CeilingProps {
  clouds: ICloud[];
  verticalVisibility: number | undefined;
}

export default function Ceiling({ clouds, verticalVisibility }: CeilingProps) {
  const heightUnit = useAppSelector((state) => state.user.heightUnit);
  const ceiling = determineCeilingFromClouds(clouds);

  return (
    <>
      {ceiling?.height != null
        ? `${formatHeight(ceiling.height, heightUnit)} AGL`
        : verticalVisibility
        ? `Vertical visibility ${formatHeight(
            verticalVisibility,
            heightUnit
          )} AGL`
        : `At least ${formatHeight(12_000, heightUnit)} AGL`}
    </>
  );
}
