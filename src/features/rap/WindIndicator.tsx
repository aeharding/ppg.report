import styled from "@emotion/styled/macro";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransformedIcon = styled(FontAwesomeIcon)<{ direction: number }>`
  transform: rotate(${({ direction }) => direction}deg);
`;

interface WindIndicatorProps {
  direction: number;
}

export default function WindIndicator({ direction }: WindIndicatorProps) {
  return <TransformedIcon icon={faLongArrowDown} direction={direction} />;
}
