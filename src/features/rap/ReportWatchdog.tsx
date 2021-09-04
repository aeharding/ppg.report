/** @jsxImportSource @emotion/react */

import { useAppDispatch } from "../../hooks";
import useInterval from "../../helpers/useInterval";
import { usePageVisibility } from "react-page-visibility";
import { useEffect, useState } from "react";
import { getRap, RapPayload } from "./rapSlice";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styled from "@emotion/styled/macro";
import differenceInMinutes from "date-fns/differenceInMinutes";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  color: var(--softText);
  font-size: 0.8em;
  text-align: right;

  @media (max-width: 700px) {
    text-align: center;
  }
`;

interface ReportWatchdogProps {
  rap: RapPayload;
}

export default function ReportWatchdog({ rap }: ReportWatchdogProps) {
  const dispatch = useAppDispatch();
  const visibility = usePageVisibility();
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useInterval(() => {
    setLastUpdated(Date.now());
  }, 5000);

  useEffect(() => {
    setLastUpdated(Date.now());
  }, [visibility]);

  useEffect(() => {
    if (document.hidden) return;

    dispatch(getRap(rap.lat, rap.lon));
  }, [lastUpdated, dispatch, rap]);

  return (
    <Container>
      <span
        css={{
          color:
            Math.abs(differenceInMinutes(new Date(rap.updated), new Date())) >
            30
              ? "red"
              : undefined,
        }}
      >
        Last updated{" "}
        {formatDistanceToNow(new Date(rap.updated), {
          addSuffix: true,
        })}
      </span>
      <br />
      Automatically updates every 30 minutes
    </Container>
  );
}
