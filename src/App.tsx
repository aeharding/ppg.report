import styled from "@emotion/styled/macro";
import Footer from "./Footer";
import WebHeader from "./header/web/Header";
import { BrowserRouter as Router } from "react-router-dom";
import AppHeader from "./header/app/Header";
import Routes from "./Routes";
import HeaderRoutes from "./header/web/HeaderRoutes";
import { css, Global } from "@emotion/react/macro";
import { writeVariables } from "./theme";
import { isInstalled } from "./helpers/device";

const Background = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;

  background: linear-gradient(
    0deg,
    var(--bg-gradient-from),
    var(--bg-gradient-to)
  );
`;
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

      <Background />

      <AppContainer>
        <AppContents>
          {isInstalled() ? (
            <AppHeader />
          ) : (
            <WebHeader>
              <HeaderRoutes />
            </WebHeader>
          )}

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
