import React, { lazy, Suspense } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faFileAlt,
  faLongArrowRight,
  IconDefinition,
} from "@fortawesome/pro-light-svg-icons";
import { css } from "@emotion/react";
import { outputP3ColorFromRGB } from "../../../helpers/colors";
import { faSearch } from "@fortawesome/pro-regular-svg-icons";
import BottomSheet from "../../../bottomSheet/BottomSheet";
import Discussion from "./discussion/Discussion";
import { useAppSelector } from "../../../hooks";
import Settings from "./settings/Settings";
import Loading from "../../../shared/Loading";
import InstallPrompt from "../../install/InstallPrompt";
import { isAfter } from "date-fns";
import Spinner from "../../../shared/Spinner";

const ReportMetadata = lazy(() => import("./reportMetadata/ReportMetadata"));

const Container = styled.div`
  padding: 0.7rem 0;

  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1rem;

  max-width: 570px;
  width: 100%;
  margin: 0 auto;
`;

export default function Extra() {
  const weather = useAppSelector((state) => state.weather.weather);
  const discussionLastViewed = useAppSelector(
    (state) => state.weather.discussionLastViewed
  );
  const discussion = useAppSelector((state) => state.weather.discussion);

  const unviewed =
    discussion && typeof discussion === "object"
      ? !discussionLastViewed ||
        isAfter(
          new Date(discussion.issuanceTime),
          new Date(discussionLastViewed)
        )
      : false;

  const gridId =
    weather && typeof weather === "object" && "properties" in weather
      ? `${weather.properties.gridId} `
      : "";

  return (
    <Container>
      <InstallPrompt />

      {discussion !== "not-available" ? (
        <BottomSheet
          openButton={
            <Item
              icon={faFileAlt}
              iconBg={[0, 255, 0]}
              iconColor="black"
              flag={unviewed}
              loading={discussion === "pending"}
            >
              Discussion
            </Item>
          }
          title={`${gridId}Area Forecast Discussion`}
        >
          <Discussion />
        </BottomSheet>
      ) : undefined}

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

const ItemContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "loading",
})<{ selected?: boolean; loading?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  text-align: center;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 300;
  cursor: pointer;

  transition: 100ms linear;
  transition-property: opacity, filter;

  ${({ loading }) =>
    loading &&
    css`
      filter: grayscale(1) brightness(60%);
      opacity: 0.5;
    `}
`;

const IconContainer = styled.div<{
  iconBg: [number, number, number];
  iconColor?: string;
  flag?: boolean;
  loading?: boolean;
}>`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  position: relative;
  margin-right: 1rem;

  &::before {
    content: "";
    inset: 0;
    position: absolute;
    z-index: -1;
    ${({ iconBg }) => outputP3ColorFromRGB(iconBg, "background")};
    border-radius: 5px;

    transition: background-color 100ms linear;
  }

  ${({ iconColor }) =>
    iconColor &&
    css`
      color: ${iconColor};
    `}

  ${({ flag }) =>
    flag &&
    css`
      &::before {
        mask: radial-gradient(
            circle at calc(100% - 1px) 1px,
            transparent 7.5px,
            #000 8.5px 100%
          )
          50% 50%/100% 100% no-repeat;
      }

      &::after {
        content: "";
        position: absolute;
        top: -3px;
        right: -3px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        ${outputP3ColorFromRGB([255, 0, 0], "background")}
      }
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
  flag?: boolean;
  loading?: boolean;
  className?: string;
}

function Item({
  icon,
  iconBg,
  iconColor,
  children,
  flag,
  loading,
  className,
}: IconProps) {
  if (loading) iconBg = [100, 100, 100];

  return (
    <ItemContainer className={className} loading={loading}>
      <IconContainer iconBg={iconBg} iconColor={iconColor} flag={flag}>
        {!loading ? <FontAwesomeIcon icon={icon} /> : <Spinner />}
      </IconContainer>
      {children}
      <RightArrow icon={faLongArrowRight} />
    </ItemContainer>
  );
}
