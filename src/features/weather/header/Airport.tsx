import React from "react";
import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";

interface AirportProps {
  fr: string;
}

const AirportContainer = styled.span<{ fr: string }>`
  font-size: 0.7em;
  border-radius: 3px;
  padding: 0 1px;

  ${({ fr }) => {
    switch (fr) {
      case "ifr":
      case "mvfr":
        return css`
          background: #b30000;
          color: white;
        `;
      case "vfr":
        return css`
          ${outputP3ColorFromRGB([0, 255, 0])}
          opacity: 0.8;
          border: 1px solid;
          ${outputP3ColorFromRGB([0, 255, 0], "border-color")}
        `;
    }
  }}
`;

export default function Airport({
  fr,
  children,
}: AirportProps & { children: React.ReactNode }) {
  return <AirportContainer fr={fr}>{children}</AirportContainer>;
}
