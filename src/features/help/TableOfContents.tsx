import styled from "@emotion/styled";
import { Dispatch, SetStateAction } from "react";
import Parallax from "../../shared/Parallax";
import ppg from "./ppg.jpg";
import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";

const Section = styled.section`
  margin: 1rem 0 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);

  h2 {
    margin: 0 0 1rem;
    font-weight: 300;
  }

  ul {
    font-size: 0.9em;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Container = styled.div`
  position: relative;
`;

const BgImg = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const WelcomeText = styled.h1`
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 1.5rem;
  font-size: 2em;
  font-weight: 100;
`;

const Warning = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: yellow;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.7);
`;

const Rest = styled.div`
  display: flex;
  flex-direction: column;

  backdrop-filter: blur(3rem);
`;

const HelpIntro = styled.div`
  margin: 0 1rem;

  text-align: justify;

  /* p:first-of-type::first-letter {
    float: left;
    font-weight: bold;
    font-size: 3rem;
    color: #00b7ff;
    padding: 4px 0.5rem 0 0;
  } */
`;

interface TableOfContentsProps {
  setSection: Dispatch<SetStateAction<HelpSection | undefined>>;
}

export type HelpSection =
  | "ui"
  | "weather"
  | "forecasting"
  | "thermals"
  | "lapse"
  | "safety";

export default function TableOfContents({ setSection }: TableOfContentsProps) {
  const { t } = useTranslation();
  return (
    <>
      <Parallax>
        <Container>
          <BgImg src={ppg} alt="" />
          <WelcomeText>PPG.report User Guide</WelcomeText>
          <Warning> ⚠️ {t("Fly Warning")}</Warning>
        </Container>
      </Parallax>
      <Rest>
        <HelpIntro>
          <p>
            Whether you just started flying or you have thousands of hours, this
            guide will help you navigate the app and make informed decisions for
            your flights. 🪂
          </p>
          <p>
            <strong>
              This guide is not a replacement for training provided by a
              qualified instructor. PPG.report strongly recommends receiving
              training BEFORE reading this guide.{" "}
              <a href="https://usppa.org/schools/">
                Find a USPPA qualified school.
              </a>
            </strong>
          </p>
          <p>Explore the sections below to get started.</p>
        </HelpIntro>

        <Section
          onClick={() => setSection("ui")}
          css={css`
            background: linear-gradient(
              to right,
              rgba(7, 201, 255, 0.15),
              rgba(0, 26, 255, 0.15)
            );
          `}
        >
          <h2>💻 User Interface Overview</h2>
          <ul>
            <li>
              Get acquainted with the main features and layout of the app.
            </li>
            <li>
              Learn about the different sections and how to access them
              efficiently.
            </li>
            <li>
              Understand the purpose and functionality of each UI element.
            </li>
          </ul>
        </Section>

        <Section
          onClick={() => setSection("weather")}
          css={css`
            background: linear-gradient(
              to top,
              rgba(255, 131, 7, 0.15),
              rgba(137, 14, 0, 0.15)
            );
          `}
        >
          <h2>⛈️ Weather Data</h2>
          <ul>
            <li>
              Discover the key weather parameters that influence flying
              conditions.
            </li>
            <li>
              Learn how to interpret meteorological data provided by the app.
            </li>
            <li>
              Understand the significance of wind speed, wind direction,
              temperature, humidity, and atmospheric pressure.
            </li>
          </ul>
        </Section>

        <Section
          onClick={() => setSection("forecasting")}
          css={css`
            background: linear-gradient(
              45deg,
              rgba(41, 68, 21, 0.456),
              rgba(0, 255, 170, 0.15)
            );
          `}
        >
          <h2>🧪 Forecasting Tools</h2>
          <ul>
            <li>Explore the forecasting tools available in PPG.report.</li>
            <li>
              Learn how to use historical data, current observations, and future
              predictions to plan your flights.
            </li>
            <li>
              Understand the significance of weather models and their impact on
              forecast accuracy.
            </li>
          </ul>
        </Section>

        <Section
          onClick={() => setSection("thermals")}
          css={css`
            background: linear-gradient(
              to right,
              rgba(164, 7, 255, 0.15),
              rgba(0, 110, 255, 0.15)
            );
          `}
        >
          <h2>🔍 Understanding Weather Patterns</h2>
          <ul>
            <li>
              Gain insight into weather patterns that affect paramotor flying.
            </li>
            <li>
              Learn about thermal activity, wind patterns, and how they can
              impact your flight experience.
            </li>
            <li>
              Understand how to identify stable and unstable weather conditions.
            </li>
          </ul>
        </Section>

        <Section
          onClick={() => setSection("lapse")}
          css={css`
            background: linear-gradient(
              20deg,
              rgba(255, 7, 7, 0.15),
              rgba(4, 255, 0, 0.15)
            );
          `}
        >
          <h2>📈 Advanced Topic: Lapse Rate</h2>
          <ul>
            <li>What Lapse Rate is</li>
            <li>
              DALR (Dry Abiatic Lapse Rate) and MALR (Moist Abiatic Lapse Rate)
            </li>
            <li>The role it plays</li>
          </ul>
        </Section>

        <Section
          onClick={() => setSection("safety")}
          css={css`
            background: linear-gradient(
              to bottom,
              rgba(255, 179, 0, 0.15),
              rgba(255, 0, 0, 0.15)
            );
          `}
        >
          <h2>⚠️ Safety Guidelines</h2>
          <ul>
            <li>
              Familiarize yourself with important safety considerations for
              paramotor flying.
            </li>
            <li>
              Learn how to assess weather-related risks and make informed
              decisions.
            </li>
            <li>
              Understand the limitations of the app and the importance of
              cross-referencing information with other sources.
            </li>
          </ul>
        </Section>

        <HelpIntro>
          <p>
            Remember, PPG.report is designed to provide valuable weather
            insights, enabling you to make informed decisions about flying
            conditions. By understanding the UI and weather concepts covered in
            this Help page, you'll be better equipped to utilize the app's
            capabilities effectively and enhance your paramotor flying
            experience.
          </p>
        </HelpIntro>
      </Rest>
    </>
  );
}
