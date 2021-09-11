import React from "react";
import {
  withServiceWorkerUpdater,
  ServiceWorkerUpdaterProps,
} from "@3m1/service-worker-updater";
import styled from "@emotion/styled/macro";
import { outputP3ColorFromRGB } from "./helpers/colors";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1em 1.5em;
  margin: 1em;
  font-size: 0.95em;
  text-align: center;

  background: rgba(255, 255, 255, 0.1);

  backdrop-filter: saturate(400%) blur(15px);
  border-radius: 5px;
  box-shadow: 0 0.7px 2.2px rgba(0, 0, 0, 0.277),
    0 1.7px 5.3px rgba(0, 0, 0, 0.358), 0 3.3px 10px rgba(0, 0, 0, 0.405),
    0 5.8px 17.9px rgba(0, 0, 0, 0.434), 0 10.9px 33.4px rgba(0, 0, 0, 0.45),
    0 26px 80px rgba(0, 0, 0, 0.45);

  cursor: pointer;
`;

const Button = styled.button`
  margin: -1em -0.5em -1em 0.5em;
  appearance: none;
  background: none;
  border: 0;
  font-size: inherit;

  cursor: pointer;

  ${outputP3ColorFromRGB([0, 255, 0])}
`;

const Updater = ({
  newServiceWorkerDetected,
  onLoadNewServiceWorkerAccept,
  ...props
}: ServiceWorkerUpdaterProps) => {
  return true ? (
    <Container {...props} onClick={onLoadNewServiceWorkerAccept}>
      New version available
      <Button onClick={onLoadNewServiceWorkerAccept}>Update now</Button>
    </Container>
  ) : null; // If no update is available, render nothing
};

export default withServiceWorkerUpdater(Updater);
