import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import HeaderRoutes from "./HeaderRoutes";

const height = "50px";

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
}`;

const Push = styled.div`
  height: ${height};

  margin-bottom: 1em;
`;

const Fixed = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: calc(${height} + env(safe-area-inset-top));

  // Allow header to be scrolled out of way on height contrained devices
  @media (orientation: landscape) and (max-height: 500px) {
    position: relative;
  }

  display: flex;

  padding: env(safe-area-inset-top) var(--left-safe-area) 0
    var(--right-safe-area);

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px) saturate(200%) brightness(80%);
`;

const Container = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
`;

export default function Header() {
  return (
    <StyledLink to="/">
      <Push>
        <Fixed>
          <Container>
            <HeaderRoutes />
          </Container>
        </Fixed>
      </Push>
    </StyledLink>
  );
}
