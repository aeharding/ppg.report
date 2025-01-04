import Location, { Button } from "../features/location/Location";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import Spinner from "../shared/Spinner";
import styled from "@emotion/styled";

const SpinnerContainer = styled.div`
  width: 3rem;
  height: 3rem;
  font-size: 1.7em;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export enum State {
  Loading,
  Submit,
  Location,
}

interface AsideButtonProps {
  state: State;
  onLocationFail: () => void;
}

export default function SubmitButton({
  state,
  onLocationFail,
}: AsideButtonProps) {
  const contents = (() => {
    switch (state) {
      case State.Location:
        return <Location onLocationFail={onLocationFail} />;
      case State.Submit:
        return (
          <Button type="submit">
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        );
      case State.Loading:
        return (
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        );
    }
  })();

  return contents;
}
