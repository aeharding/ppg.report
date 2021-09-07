import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import { ReactComponent as Icon } from "../icon.svg";
import HeaderRoutes from "./HeaderRoutes";
import { useLocation } from "react-router";
import { css } from "@emotion/react/macro";

const height = "50px";

const Container = styled.div`
  height: ${height};

  margin-bottom: 1em;

  @media (orientation: landscape) {
    display: none;
  }
`;

const Content = styled.div<{ center: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: calc(${height} + env(safe-area-inset-top));

  display: flex;
  align-items: center;

  ${({ center }) =>
    center &&
    css`
      justify-content: center;
    `}

  padding: env(safe-area-inset-top) 0.8em 0;

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const StyledIcon = styled(Icon)`
  height: 25px;

  transform: translateY(-1px);
`;

const Title = styled.h1`
  margin: 0 0 0 0.6em;
  font-size: 1.5em;
`;

const RouteContainer = styled.div`
  font-size: 0.7em;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default function Header() {
  const location = useLocation();

  return (
    <Link to="/">
      <Container>
        <Content center={location.pathname === "/"}>
          <StyledIcon />{" "}
          {location.pathname === "/" && <Title>PPG.report</Title>}
          <RouteContainer>
            <HeaderRoutes />
          </RouteContainer>
        </Content>
      </Container>
    </Link>
  );
}
