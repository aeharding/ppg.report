import styled from "@emotion/styled/macro";
import { isInApp } from "../../helpers/device";
import { ReactComponent as ShareIcon } from "./share.svg";
import { ReactComponent as AddIcon } from "./add.svg";
import CopyLink from "./CopyLink";

const Container = styled.div`
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AppSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const AppIcon = styled.img`
  height: 4rem;
  margin: 0 1rem;
  border-radius: 1rem;
`;

const AppTitle = styled.div`
  font-size: 1.2rem;
`;

const AppAuthor = styled.div`
  opacity: 0.7;
  font-size: 0.9rem;
`;

const List = styled.ol`
  margin-bottom: 0;

  li {
    margin-bottom: 0.5rem;
  }
`;

const StyledShareIcon = styled(ShareIcon)`
  height: 1.25rem;
  padding: 0 0.25rem;
  color: #007aff;
`;

const StyledAddIcon = styled(AddIcon)`
  height: 1rem;
`;

const AddToHomescreenContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 3px 8px;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
`;

export default function InstallInstructions() {
  const isSafari = !isInApp();

  function renderSafariInstallInstructions() {
    return (
      <List>
        <li>
          Tap on <StyledShareIcon /> in the tab bar
        </li>
        <li>
          Scroll and tap{" "}
          <AddToHomescreenContainer>
            Add to Home Screen <StyledAddIcon />
          </AddToHomescreenContainer>
        </li>
      </List>
    );
  }

  function renderInAppBrowserInstallInstructions() {
    return (
      <>
        <p>
          It looks like you're using an in-app browser. To install PPG.report,
          open this link in Safari.
        </p>
        <CopyLink />
      </>
    );
  }

  <Container>
    <AppSummary>
      <AppIcon src="/manifest-icon-512.png" />
      <div>
        <AppTitle>PPG.report</AppTitle>
        <AppAuthor>by Alexander Harding</AppAuthor>
      </div>
    </AppSummary>
    {isSafari
      ? renderSafariInstallInstructions()
      : renderInAppBrowserInstallInstructions()}
  </Container>;
}
