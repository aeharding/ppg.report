import styled from "@emotion/styled";
import { Remark } from "metar-taf-parser";
import { capitalizeFirstLetter } from "../../../../helpers/string";
import { css } from "@emotion/react";
import { useState } from "react";

const List = styled.ul`
  margin: 0;
  padding: 0;
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);

  span {
    color: white;
  }
`;

const Collapser = styled.div<{ collapsed: boolean }>`
  ${({ collapsed }) =>
    collapsed &&
    css`
      position: relative;

      &::after {
        content: "Expand";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        font-size: 0.8em;
        backdrop-filter: blur(4px);

        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 50px;
        padding: 0.25rem 0.5rem;
      }

      ${List} {
        max-height: 75px;
        overflow: hidden;

        // Hack to fix bullets being hidden by overflow
        padding: 0 1rem;
        margin: 0 -1rem;

        mask: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 1) 0,
            rgba(0, 0, 0, 1) 45%,
            rgba(0, 0, 0, 0.2) 75%,
            rgba(0, 0, 0, 0) 95%,
            rgba(0, 0, 0, 0) 0
          )
          100% 50% / 100% 100% repeat-x;
      }
    `}
`;

interface RemarksProps {
  remarks: Remark[];
}

export default function Remarks({ remarks }: RemarksProps) {
  const [collapsed, setCollapsed] = useState(remarks.length > 3);

  return (
    <Collapser collapsed={collapsed} onMouseDown={() => setCollapsed(false)}>
      <List>
        {remarks.map((remark, index) => (
          <li key={index}>
            <span>
              {remark.description
                ? capitalizeFirstLetter(remark.description)
                : remark.raw}
            </span>
            <br></br>
          </li>
        ))}
      </List>
    </Collapser>
  );
}
