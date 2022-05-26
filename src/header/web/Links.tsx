import styled from "@emotion/styled/macro";
import { NavLink, useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0 1rem 0 1.5rem;

  a {
    padding: 0.25rem 0.5rem;

    &.active {
      border-bottom: 2px solid white;
    }

    &,
    &:hover {
      text-decoration: none;
    }
  }
`;

export default function Links() {
  const location = useLocation();

  return (
    <Container>
      <NavLink
        to={
          new URL(`${location.pathname}/../outlook`, "https://e.com").pathname
        }
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Outlook
      </NavLink>
      <NavLink
        to={new URL(`${location.pathname}/../aloft`, "https://e.com").pathname}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Aloft
      </NavLink>
    </Container>
  );
}
