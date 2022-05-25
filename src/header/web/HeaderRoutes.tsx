import styled from "@emotion/styled/macro";
import { Route, Routes } from "react-router-dom";
import ReportHeader from "./ReportHeader";
import Links from "./Links";

const Container = styled.div`
  flex: 1;

  display: flex;
  align-items: center;
`;

const LinksContainer = styled.div`
  margin-right: auto;
`;

export default function HeaderRoutes() {
  return (
    <Routes>
      <Route
        path="/:lat,:lon/*"
        element={
          <Container>
            <LinksContainer>
              <Links />
            </LinksContainer>
            <div>
              <ReportHeader />
            </div>
          </Container>
        }
      />
    </Routes>
  );
}
