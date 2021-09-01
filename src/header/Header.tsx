import styled from "@emotion/styled/macro";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 975px;
  margin: 1em auto;

  display: flex;
  align-items: center;
`;

const Aside = styled.aside`
  margin-left: auto;
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

      <Aside>{children}</Aside>
    </HeaderContainer>
  );
}
