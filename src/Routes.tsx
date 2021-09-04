import React, { useRef } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Terms from "./routes/Terms";
import Report from "./routes/Report";
import styled from "@emotion/styled/macro";
import { CSSTransition, SwitchTransition } from "react-transition-group";

// Just a fun transition from app loading -> loaded
const pageTransition = "routes-transition";
const TransitionContainer = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  &.${pageTransition}-enter {
    opacity: 0;
    transform: scale(1.015);
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
    transform: scale(0.985);
    transition: opacity 150ms, transform 150ms;
  }
`;

export default function Routes() {
  const nodeRef = useRef(null);
  const location = useLocation();

  const content = (() => {
    return (
      <Switch location={location}>
        <Route path="/:lat,:lon" component={Report} />
        <Route path="/terms" exact>
          <Terms />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    );
  })();

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
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
