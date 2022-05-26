/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react/macro";
import styled from "@emotion/styled/macro";
import { FunctionComponent } from "react";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 0 1em;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const iconStyles = css`
  width: 8em;

  margin-right: 2em;
  height: auto;

  @media (max-width: 600px) {
    margin-right: 0;
    margin-bottom: 2em;
  }
`;

const Title = styled.h2`
  margin: 0 0 0.5rem;
  font-weight: 200;
`;

const Description = styled.p`
  margin: 0;
`;

interface ErrorProps {
  icon: FunctionComponent<{ className?: string }>;
  title: string;
  description: React.ReactNode;
}

export default function Error({ icon: Icon, title, description }: ErrorProps) {
  return (
    <Container>
      <Icon css={iconStyles} />{" "}
      <div>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </div>
    </Container>
  );
}
