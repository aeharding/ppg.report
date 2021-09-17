import styled from "@emotion/styled/macro";
import Tippy from "@tippyjs/react";
import { Rap } from "gsl-parser";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggle, toggleAltitude } from "../user/userSlice";
import Altitude from "./cells/Altitude";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import { headerText } from "./CinCape";

const TableEl = styled.table`
  width: 100%;
  text-align: center;
  overflow: hidden;

  th {
    ${headerText}
  }
`;

const InteractTh = styled.th`
  cursor: pointer;
`;

interface TableProps {
  rap: Rap;
  rows: number; // number of altitudes/rows to render
}

export default function Table({ rap, rows }: TableProps) {
  const dispatch = useAppDispatch();
  const altitudeType = useAppSelector((state) => state.user.altitude);

  const surfaceLevel = rap.data[0].height;

  return (
    <TableEl>
      <thead>
        <tr>
          <Tippy
            content={`Switch to ${toggle(altitudeType)}`}
            placement="top"
            hideOnClick={false}
          >
            <InteractTh onClick={() => dispatch(toggleAltitude())}>
              Altitude
            </InteractTh>
          </Tippy>
          <th>Temp</th>
          <th>Direction</th>
          <th>Speed</th>
        </tr>
      </thead>

      <tbody>
        {rap.data.slice(0, rows).map((datum, index) => (
          <tr key={index}>
            <td>
              <Altitude height={datum.height} surfaceLevel={surfaceLevel} />
            </td>
            <td>
              <Temperature temperature={datum.temp} />
            </td>
            <td>
              <WindDirection
                curr={datum.windDir}
                prev={rap.data[index - 1]?.windDir}
              />
            </td>
            <td>
              <WindSpeed
                curr={datum.windSpd}
                prev={rap.data[index - 1]?.windSpd}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </TableEl>
  );
}
