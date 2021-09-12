import { useEffect, useRef } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getRap } from "../features/rap/rapSlice";
import Hours from "../features/rap/Hours";
import { useAppDispatch, useAppSelector } from "../hooks";
import Loading from "../shared/Loading";
import { getTrimmedCoordinates, isLatLonTrimmed } from "../helpers/coordinates";
import Error from "../shared/Error";
import { ReactComponent as Map } from "../assets/map.svg";
import { ReactComponent as ErrorSvg } from "../assets/error.svg";
import NotFound from "./NotFound";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "@emotion/styled/macro";

// Just a fun transition from app loading -> loaded
const pageTransition = "loading-report-transition";
const TransitionContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  &.${pageTransition}-enter {
    opacity: 0;
    transform: scale(1.001);
  }

  &.${pageTransition}-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity 150ms, transform 150ms;
  }

  &.${pageTransition}-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.${pageTransition}-exit-active {
    opacity: 0;
    transform: scale(0.999);
    transition: opacity 150ms, transform 150ms;
  }
`;

interface ReportProps
  extends RouteComponentProps<{ lat: string; lon: string }> {}

export default function Report(props: ReportProps) {
  const { lat, lon } = props.match.params;

  if (isNaN(+lat) || isNaN(+lon)) return <NotFound />;

  return <ValidParamsReport {...props} />;
}

function ValidParamsReport(props: ReportProps) {
  const { lat, lon } = props.match.params;

  const dispatch = useAppDispatch();
  const rap = useAppSelector(
    (state) => state.rap.rapByLocation[getTrimmedCoordinates(+lat, +lon)]
  );
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!isLatLonTrimmed(lat, lon)) return;

    dispatch(getRap(+lat, +lon));
  }, [dispatch, lat, lon]);

  if (!isLatLonTrimmed(lat, lon)) {
    return <Redirect to={getTrimmedCoordinates(+lat, +lon)} push={false} />;
  }

  const content = (() => {
    switch (rap) {
      case "pending":
      case undefined:
        return <Loading />;
      case "failed":
        return (
          <Error
            icon={ErrorSvg}
            title="shit broke"
            description="It appears there was a problem with the data source. Please try again later."
          />
        );
      case "coordinates-error":
        return (
          <Error
            icon={Map}
            title="That's an unknown place."
            description="Contiguous United States locations are only supported."
          />
        );
      default:
        return <Hours rap={rap} />;
    }
  })();

  return (
    <SwitchTransition>
      <CSSTransition
        key={content.key}
        timeout={150}
        classNames={pageTransition}
        unmountOnExit
        // https://github.com/reactjs/react-transition-group/issues/668
        nodeRef={nodeRef}
      >
        <TransitionContainer ref={nodeRef}>{content}</TransitionContainer>
      </CSSTransition>
    </SwitchTransition>
  );
}
