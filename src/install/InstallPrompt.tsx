import styled from "@emotion/styled/macro";
import { faDownload } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import BottomSheet from "../bottomSheet/BottomSheet";
import { isInstalled } from "../helpers/device";
import { ReactComponent as ShareIcon } from "./share.svg";
import { ReactComponent as ArrowIcon } from "./arrow.svg";
import { keyframes } from "@emotion/css";
import { outputP3ColorFromRGB } from "../helpers/colors";

const PromoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: linear-gradient(
    140deg,
    color(display-p3 0 0.2 0),
    color(display-p3 0 0.6 0)
  );
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 1rem;
`;

const PromoButton = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
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

  ${outputP3ColorFromRGB([0, 255, 0])}
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
  if (isInstalled()) return <></>;

  return (
    <>
      <BottomSheet
        openButton={
          <PromoContainer>
            Like PPG.report so far? Install it to your homescreen for a better
            experience.
            <PromoButton>
              Get the app <FontAwesomeIcon icon={faDownload} />
            </PromoButton>
          </PromoContainer>
        }
        title="Install the app"
      >
        <InstallInstructions>
          Installing the app on your iPhone is free and easy
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
            <div>Install Now</div>
          </InstallNow>
        </InstallInstructions>
      </BottomSheet>
    </>
  );
}
