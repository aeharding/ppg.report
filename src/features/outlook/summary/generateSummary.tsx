import styled from "@emotion/styled/macro";

const Reference = styled.span`
  text-decoration: underline dashed rgba(255, 255, 255, 0.5);
`;

export default function generateSummary() {
  return (
    <>
      Tomorrow morning <Reference>looks promising.</Reference>
    </>
  );
}
