import styled from "@emotion/styled/macro";
import { faArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransformedIcon = styled(FontAwesomeIcon)<{ direction: number }>`
  transform: rotate(${({ direction }) => direction}deg);
`;

interface WindDirectionProps {
  direction: number;
}

export default function WindDirection({ direction }: WindDirectionProps) {
  return (
    <>
      {direction} <TransformedIcon icon={faArrowDown} direction={direction} />
    </>
  );
}
