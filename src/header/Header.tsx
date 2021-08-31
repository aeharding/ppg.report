import styled from "@emotion/styled/macro";
import Logo from "./Logo";

const HeaderContainer = styled.div`
  margin: 1em 0;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
}
