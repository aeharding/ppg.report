import styled from "@emotion/styled/macro";
import React from "react";
import BottomSheet from "../bottomSheet/BottomSheet";
import { isInstalled } from "../helpers/device";
import { ReactComponent as ShareIcon } from "./share.svg";
import { ReactComponent as ArrowIcon } from "./arrow.svg";
import { keyframes } from "@emotion/css";
import { outputP3ColorFromRGB } from "../helpers/colors";
import { useAddToHomescreenPrompt } from "../helpers/useAddToHomescreenPrompt";

const PromoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  background: linear-gradient(140deg, rgb(0 25 51), rgb(0 25 255));
  background: linear-gradient(
    140deg,
    color(display-p3 0 0.1 0.2),
    color(display-p3 0 0.1 1)
  );
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 1rem;
`;

const PromoButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  font-size: 1.1em;

  align-self: flex-end;

  span {
    font-size: 1.1em;
  }
`;

const InstallInstructions = styled.div`
  padding: 1rem 0.5rem 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const StyledShareIcon = styled(ShareIcon)`
  height: 1.25rem;
  padding: 0 0.25rem;
  color: #007aff;
`;

const Blue = styled.span`
  color: #007aff;
`;

const InstallNow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;

  ${outputP3ColorFromRGB([255, 255, 0])}
`;

const bounce = keyframes`
  0% {
    transform: translateY(0) scale(0.95);
  }
  100% {
    transform: translateY(5px) scale(1);
  }
`;

const IconWrapper = styled.div`
  animation: ${bounce} 500ms ease-out;
  animation-direction: alternate;
  animation-iteration-count: infinite;
`;

const StyledArrowIcon = styled(ArrowIcon)`
  height: 3em;
  padding: 0 0.25em;
  aspect-ratio: 1;

  transform: rotate(90deg);
`;

export default function InstallPrompt() {
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [isVisible, setVisibleState] = React.useState(false);
  const hide = () => setVisibleState(false);

  React.useEffect(() => {
    if (prompt) {
      setVisibleState(true);
    }
  }, [prompt]);

  function renderiPhonePromo() {
    return (
      <>
        <BottomSheet openButton={<Promo />} title="Install the app">
          <InstallInstructions>
            <div>Installing the app on your iPhone is easy and free</div>
            <ol>
              <li>
                Tap the <StyledShareIcon /> icon in the Safari toolbar
              </li>
              <li>
                Tap “<Blue>Add to Home Screen</Blue>” near the bottom
              </li>
              <li>
                Tap “<Blue>Add</Blue>”
              </li>
            </ol>
            <InstallNow>
              <IconWrapper>
                <StyledArrowIcon />
              </IconWrapper>{" "}
              <div>Install now</div>
            </InstallNow>
          </InstallInstructions>
        </BottomSheet>
      </>
    );
  }

  if (isInstalled()) return <></>;
  if (navigator.userAgent.match(/iPhone/i)) return renderiPhonePromo();
  if (!isVisible) return <></>;

  return (
    <Promo
      onClick={() => {
        promptToInstall();
        hide();
      }}
    />
  );
}

function Promo({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <PromoContainer onClick={onClick}>
      Obsessed about weather? For a better experience, get the app installed on
      your homescreen.
      <PromoButton>
        Install app <span>🚀</span>
      </PromoButton>
    </PromoContainer>
  );
}
