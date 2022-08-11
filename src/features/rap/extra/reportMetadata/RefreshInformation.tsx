/** @jsxImportSource @emotion/react */

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { useAppSelector } from "../../../../hooks";
import styled from "@emotion/styled/macro";
import { DataListItem } from "../../../../DataList";
import capitalize from "lodash/capitalize";

const Label = styled.div``;

export default function RefreshInformation() {
  const rapUpdated = useAppSelector((state) => state.rap.rapUpdated);

  return (
    <>
      <DataListItem>
        <Label>Data last fetched</Label>
        <div
          css={{
            color:
              rapUpdated &&
              Math.abs(differenceInMinutes(new Date(rapUpdated), new Date())) >
                30
                ? "red"
                : undefined,
          }}
        >
          {rapUpdated
            ? capitalize(
                formatDistanceToNow(new Date(rapUpdated), {
                  addSuffix: true,
                })
              )
            : "Never"}
        </div>
      </DataListItem>
      <DataListItem>
        <Label>Update interval</Label>
        <div>Every 30 minutes</div>
      </DataListItem>
    </>
  );
}
