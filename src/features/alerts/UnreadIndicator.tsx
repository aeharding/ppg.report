import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { getAlertId } from "../../helpers/alert";
import { useAppSelector } from "../../hooks";
import { Alert } from "./alertsSlice";

const Bubble = styled.div<{ read: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: #0080ff;

  ${({ read }) =>
    read &&
    css`
      visibility: hidden;
    `}
`;

interface UnreadIndicatorProps {
  alert: Alert;
}

export default function UnreadIndicator({ alert }: UnreadIndicatorProps) {
  const readAlerts = useAppSelector((state) => state.user.readAlerts);

  return <Bubble read={!!readAlerts[getAlertId(alert)]} />;
}
