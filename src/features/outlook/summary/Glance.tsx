import styled from "@emotion/styled/macro";
import { faLongArrowRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Reference = styled.span`
  text-decoration: underline dashed rgba(255, 255, 255, 0.5);
`;

const StyledLink = styled(Link)`
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 2px 8px;
  margin-top: 1rem;

  &,
  &:hover {
    text-decoration: none;
  }

  svg {
    opacity: 0.4;
  }
`;

export default function Glance() {
  return (
    <>
      <div>
        Tomorrow morning <Reference>looks promising.</Reference>
      </div>
      <StyledLink to="../aloft">
        Winds aloft <FontAwesomeIcon icon={faLongArrowRight} />
      </StyledLink>
    </>
  );
}
