import styled from "@emotion/styled/macro";
import { ThemeProvider } from "@material-ui/styles";
import Footer from "./Footer";
import { createMuiTheme } from "./theme";
import Header from "./header/Header";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import HeaderRoutes from "./HeaderRoutes";

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
  const theme = createMuiTheme();

  return (
    <ThemeProvider theme={theme}>
      <Router>
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
    </ThemeProvider>
  );
}

export default App;
