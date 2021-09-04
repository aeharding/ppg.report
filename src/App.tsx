import styled from "@emotion/styled/macro";
import Footer from "./Footer";
import Header from "./header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import HeaderRoutes from "./HeaderRoutes";
import { useAppSelector } from "./hooks";
import { css, Global, ThemeProvider } from "@emotion/react/macro";
import { Themes, writeVariables } from "./theme";

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
  const theme = useAppSelector((store) => store.user.theme);

  // Theme colors for computations (e.g. use with chroma-js)
  const jsTheme = (() => {
    switch (theme) {
      case Themes.Dark:
        return {
          text: "white",
          yellow: "yellow",
        };
      case Themes.Light:
        return {
          text: "black",
          yellow: "#e7d800",
        };
    }
  })();

  return (
    <Router>
      <Global
        styles={css`
          html {
            ${writeVariables(theme)}
          }
        `}
      />

      <ThemeProvider theme={jsTheme}>
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
      </ThemeProvider>
    </Router>
  );
}

export default App;
