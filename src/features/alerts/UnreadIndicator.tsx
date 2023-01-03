import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { isAlertRead } from "../../helpers/alert";
import { useAppSelector } from "../../hooks";
import { OnOff } from "../user/userSlice";
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
  const userState = useAppSelector((state) => state.user);

  return (
    <Bubble
      // Force gAirmetRead to false to show the bubble state regardless of setting
      read={isAlertRead(alert, { ...userState, gAirmetRead: OnOff.Off })}
    />
  );
}
