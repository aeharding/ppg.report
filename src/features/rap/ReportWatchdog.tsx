import { useAppDispatch } from "../../hooks";
import useInterval from "../../helpers/useInterval";
import { usePageVisibility } from "react-page-visibility";
import { useEffect, useState } from "react";
import { getRap, RapPayload } from "./rapSlice";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styled from "@emotion/styled/macro";

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1em;

  color: var(--softText);
  font-size: 0.8em;
  text-align: right;
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

    dispatch(getRap(rap.data[0].lat, rap.data[0].lon));
  }, [lastUpdated, dispatch, rap]);

  return (
    <Container>
      Last updated{" "}
      {formatDistanceToNow(new Date(rap.updated), {
        addSuffix: true,
      })}
      <br />
      Automatically updates every 30 minutes
    </Container>
  );
}
