import Wind from "../features/wind/Wind";
import Search from "../Search";
import styled from "@emotion/styled/macro";

const StyledSearch = styled(Search)`
  margin: 4rem auto 0;
`;

export default function Home() {
  return (
    <>
      <Wind />
      <StyledSearch />
    </>
  );
}
