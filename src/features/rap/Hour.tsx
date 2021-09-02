import styled from "@emotion/styled/macro";
import { useState } from "react";
import Rap from "../../models/Rap";
import Height from "./cells/Height";
import Temperature from "./cells/Temperature";
import WindDirection from "./cells/WindDirection";
import WindSpeed from "./cells/WindSpeed";
import CinCape, { headerText } from "./CinCape";
import SunCalc from "suncalc";
import chroma from "chroma-js";
import startOfTomorrow from "date-fns/startOfTomorrow";
import subDays from "date-fns/subDays";
import format from "date-fns/format";

const Column = styled.div`
  position: relative;
`;

const Container = styled.div`
  padding: 0.75em 0;

  position: relative;

  border-radius: 1em;
  box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.7);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  margin: 0 1em;
`;

const HourContainer = styled.h3`
  font-size: 1.6em;
  font-weight: 200;
  margin: 0;

  sup {
    font-size: 0.6em;
    font-weight: 300;
    opacity: 0.6;
  }
`;

const Table = styled.table`
  width: 100%;
  text-align: center;
  overflow: hidden;

  th {
    ${headerText}
  }
`;

interface HourProps {
  rap: Rap;
}

export default function Hour({ rap, ...rest }: HourProps) {
  const [yesterdayTimes] = useState(
    SunCalc.getTimes(subDays(new Date(rap.date), 1), rap.lat, rap.lon)
  );
  const [times] = useState(
    SunCalc.getTimes(new Date(rap.date), rap.lat, rap.lon)
  );

  const colorScale = chroma
    .scale([
      "#0000004d",
      "#6666660e",
      "#ffffff0a",
      "#ffffff0a",
      "#6666660e",
      "#0000004d",
      "#0000004d",
      "#6666660e",
      "#ffffff0a",
      "#ffffff0a",
      "#6666660e",
      "#0000004d",
    ])
    .mode("lch")
    .domain([
      yesterdayTimes.sunrise.getTime() - 0.2 * 60 * 60 * 1000,
      yesterdayTimes.sunrise.getTime() + 0.5 * 60 * 60 * 1000,
      yesterdayTimes.sunrise.getTime() + 4 * 60 * 60 * 1000,

      yesterdayTimes.sunset.getTime() - 4.5 * 60 * 60 * 1000,
      yesterdayTimes.sunset.getTime() - 4 * 60 * 60 * 1000,
      yesterdayTimes.sunset.getTime() + 0.5 * 60 * 60 * 1000,

      times.sunrise.getTime() - 0.5 * 60 * 60 * 1000,
      times.sunrise.getTime() + 0.5 * 60 * 60 * 1000,
      times.sunrise.getTime() + 6 * 60 * 60 * 1000,

      times.sunset.getTime() - 4.5 * 60 * 60 * 1000,
      times.sunset.getTime() - 4 * 60 * 60 * 1000,
      times.sunset.getTime() + 0.5 * 60 * 60 * 1000,
    ]);

  const surfaceLevel = rap.data[0].height;

  return (
    <Column {...rest}>
      <Header>
        <HourContainer>
          {format(new Date(rap.date), "h:mmaaaaa")}
          {new Date(rap.date).getTime() >= startOfTomorrow().getTime() && (
            <sup>+1</sup>
          )}
        </HourContainer>

        <CinCape cin={rap.cin} cape={rap.cape} />
      </Header>

      <Container
        style={{
          backgroundColor: colorScale(new Date(rap.date).getTime()).css(),
        }}
      >
        <Table>
          <thead>
            <tr>
              <th>Altitude</th>
              <th>Temp</th>
              <th>Direction</th>
              <th>Speed</th>
            </tr>
          </thead>

          <tbody>
            {rap.data
              .filter(({ height }) => height < 5800)
              .map((datum, index) => (
                <tr key={index}>
                  <td>
                    <Height height={datum.height} surfaceLevel={surfaceLevel} />
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
        </Table>
      </Container>
    </Column>
  );
}
