import styled from "@emotion/styled";

export const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DataListItem = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;

  > *:first-of-type {
    opacity: 0.7;
  }

  &:not(:last-of-type) {
    &:after {
      content: "";
      position: absolute;
      left: 2rem;
      right: 2rem;
      bottom: calc(-0.5rem - 1px);

      height: 0.5px;
      background: #333;
    }
  }
`;
