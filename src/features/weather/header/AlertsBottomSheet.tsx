import styled from "@emotion/styled/macro";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import AlertsBody from "../../alerts/Alerts";
import { Feature } from "../weatherSlice";

const StyledBottomSheet = styled(BottomSheet)`
  --rsbs-handle-bg: transparent;
  --rsbs-bg: #111317;
  --rsbs-max-w: 500px;

  --rsbs-ml: auto;
  --rsbs-mr: auto;

  [data-rsbs-header] {
    padding: 0 !important;
  }
`;

const Header = styled.div`
  margin: 0.75rem 1rem;

  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
`;

const CloseContainer = styled.div`
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 2.5rem;

  margin-left: auto;
`;

interface AlertsBottomSheetProps {
  alerts: Feature[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AlertsBottomSheet({
  alerts,
  open,
  setOpen,
}: AlertsBottomSheetProps) {
  return (
    <StyledBottomSheet
      open={open}
      onDismiss={() => setOpen(false)}
      header={
        <Header>
          Weather Service Alerts
          <CloseContainer onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseContainer>
        </Header>
      }
      snapPoints={({ maxHeight, minHeight }) => [
        Math.min(maxHeight - maxHeight / 10, minHeight),
      ]}
      expandOnContentDrag
      initialFocusRef={false}
    >
      {alerts?.length ? <AlertsBody alerts={alerts} /> : ""}
    </StyledBottomSheet>
  );
}
