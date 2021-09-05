import Wind from "../features/wind/Wind";
import Search from "../Search";
import styled from "@emotion/styled/macro";
import Locations from "../features/user/Locations";
import { useAppSelector } from "../hooks";
import { css } from "@emotion/react/macro";

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const StyledSearch = styled(Search)<{ hasLocations: boolean }>`
  margin: 4rem auto 0;

  ${({ hasLocations }) =>
    hasLocations &&
    css`
      @media (max-width: 600px) {
        margin-top: 0;
      }
    `}
`;

export default function Home() {
  const locations = useAppSelector((state) => state.user.recentLocations);

  return (
    <Container>
      <Wind />
      <StyledSearch hasLocations={locations.length !== 0} />
      <Locations />
    </Container>
  );
}
