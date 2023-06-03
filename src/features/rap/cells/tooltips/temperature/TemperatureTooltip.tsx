import { relativeHumidityFromDewPoint } from "velitherm";
import Tooltip from "../../../../../shared/Tooltip";
import styled from "@emotion/styled";
import RH from "./RH";
import Temp from "./Temp";
import Dewpt from "./Dewpt";
import Spread from "./Spread";
import { css } from "@emotion/react";
import { useAppSelector } from "../../../../../hooks";
import { OnOff } from "../../../extra/settings/settingEnums";

const Table = styled.table`
  border-collapse: collapse;
  text-align: left;

  td:nth-child(1) {
    padding-right: 0.7rem;
  }

  td:nth-child(2) {
    text-align: right;

    font-family: "Courier New", Courier, monospace;
    font-weight: 600;
    font-size: 1.2em;
  }
`;

interface TemperatureTooltipProps {
  children?: React.ReactNode;
  dewpoint: number;
  temperature: number;
}

export default function TemperatureTooltip({
  children,
  dewpoint,
  temperature,
}: TemperatureTooltipProps) {
  const advanced = useAppSelector((state) => state.user.advanced);

  function renderContents() {
    return (
      <Table>
        <tbody>
          <tr>
            <td>Temp</td>
            <Temp inCelsius={temperature} />
          </tr>
          <tr
            css={css`
              opacity: 0.6;
            `}
          >
            <td>Spread</td>
            <Spread inCelsius={temperature - dewpoint} />
          </tr>
          <tr>
            <td>Dewpt</td>
            <Dewpt inCelsius={dewpoint} />
          </tr>
          <tr>
            <td>RH</td>
            <RH rh={relativeHumidityFromDewPoint(dewpoint, temperature)} />
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Tooltip contents={renderContents} mouseOnly={advanced === OnOff.Off}>
      {children}
    </Tooltip>
  );
}
