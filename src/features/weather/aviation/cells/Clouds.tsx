import { ICloud } from "metar-taf-parser";
import Cloud from "./Cloud";
import React from "react";

interface CloudsProps {
  clouds: ICloud[];
  verticalVisibility: number | undefined;
}

export default function Clouds({ clouds, verticalVisibility }: CloudsProps) {
  return (
    <>
      {clouds.map((cloud, index) => (
        <React.Fragment key={index}>
          <Cloud data={cloud} />
          <br />
        </React.Fragment>
      ))}
      {verticalVisibility != null ? <>Obscured sky</> : undefined}
    </>
  );
}
