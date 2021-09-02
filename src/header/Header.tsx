import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1em auto;
  padding: 0 1em;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <HeaderContainer>
      <StyledLink to="/">
        <Logo />
      </StyledLink>

      <aside>{children}</aside>
    </HeaderContainer>
  );
}
