import React, { lazy, Suspense } from "react";
import styled from "@emotion/styled/macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faFileAlt,
  faLongArrowRight,
  IconDefinition,
} from "@fortawesome/pro-light-svg-icons";
import { css } from "@emotion/react/macro";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { faSearch } from "@fortawesome/pro-regular-svg-icons";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import Discussion from "./Discussion";
import { useAppSelector } from "../../../hooks";
import Settings from "./settings/Settings";
import Loading from "../../../shared/Loading";

const ReportMetadata = lazy(() => import("./reportMetadata/ReportMetadata"));

const Container = styled.div`
  padding: 0.7rem 0;

  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1rem;

  max-width: 600px;
  width: 100%;
  margin: 0 auto;
`;

export default function Extra() {
  const weather = useAppSelector((state) => state.weather.weather);

  const gridId =
    weather && typeof weather === "object"
      ? `${weather.properties.gridId} `
      : "";

  return (
    <Container>
      <BottomSheet
        openButton={
          <Item icon={faSearch} iconBg={[255, 0, 0]}>
            Report Metadata
          </Item>
        }
        title="Report Metadata"
      >
        <Suspense fallback={<Loading />}>
          <ReportMetadata />
        </Suspense>
      </BottomSheet>

      <BottomSheet
        openButton={
          <Item icon={faFileAlt} iconBg={[0, 255, 0]} iconColor="black">
            Discussion
          </Item>
        }
        title={`${gridId}Area Forecast Discussion`}
      >
        <Discussion />
      </BottomSheet>
      <BottomSheet
        openButton={
          <Item icon={faCog} iconBg={[20, 20, 20]}>
            Settings
          </Item>
        }
        title="Settings"
      >
        <Settings />
      </BottomSheet>
    </Container>
  );
}

const ItemContainer = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  text-align: center;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
  cursor: pointer;
`;

const IconContainer = styled.div<{
  iconBg: [number, number, number];
  iconColor?: string;
}>`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  margin-right: 1rem;
  border-radius: 5px;
  ${({ iconBg }) => outputP3ColorFromRGB(iconBg, "background")};
  ${({ iconColor }) =>
    iconColor &&
    css`
      color: ${iconColor};
    `}
`;

const RightArrow = styled(FontAwesomeIcon)`
  margin-left: auto;
  opacity: 0.5;
`;

interface IconProps {
  icon: IconDefinition;
  iconBg: [number, number, number];
  iconColor?: string;
  children?: React.ReactNode;
}

function Item({ icon, iconBg, iconColor, children }: IconProps) {
  return (
    <ItemContainer>
      <IconContainer iconBg={iconBg} iconColor={iconColor}>
        <FontAwesomeIcon icon={icon} />
      </IconContainer>
      {children}
      <RightArrow icon={faLongArrowRight} />
    </ItemContainer>
  );
}
