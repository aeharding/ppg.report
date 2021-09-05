import styled from "@emotion/styled/macro";
import Footer from "./Footer";
import Header from "./header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import HeaderRoutes from "./HeaderRoutes";
import { css, Global } from "@emotion/react/macro";
import { writeVariables } from "./theme";

const AppContainer = styled.div`
  flex: 1;

  width: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const AppContents = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <Global
        styles={css`
          html {
            ${writeVariables()}
          }
        `}
      />
      <AppContainer>
        <AppContents>
          <Header>
            <HeaderRoutes />
          </Header>

          <Main>
            <Routes />
          </Main>
          <Footer />
        </AppContents>
      </AppContainer>
    </Router>
  );
}

export default App;
