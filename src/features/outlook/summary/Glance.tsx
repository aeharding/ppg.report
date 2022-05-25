import styled from "@emotion/styled/macro";
import { faLongArrowRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import generateSummary from "./generateSummary";

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

enum Type {
  Promising,
  Great,
  Nothing,
}
interface Observed {
  date: Date;
}

interface Promising extends Observed {
  warnings: string[];
}

interface Great extends Observed {}

interface Nothing {}

export default function Glance() {
  return (
    <>
      <div>{generateSummary()}</div>
      <StyledLink to="../aloft">
        Winds aloft <FontAwesomeIcon icon={faLongArrowRight} />
      </StyledLink>
    </>
  );
}
