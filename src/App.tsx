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
  inset: 0;
  z-index: -1;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;

    filter: sepia() hue-rotate(170deg) saturate(400%) brightness(17%);

    background: linear-gradient(
        139deg,
        rgba(26, 23, 125, 1),
        rgba(13, 214, 0, 0.7)
      ),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 100vw 100vh' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-size: cover;
  }
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
          :root {
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
