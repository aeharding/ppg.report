import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { useAppSelector } from "../../../../hooks";
import styled from "@emotion/styled";
import { DataListItem } from "../../../../DataList";
import capitalize from "lodash/capitalize";

const Label = styled.div``;

export default function RefreshInformation() {
  const windsAloftUpdated = useAppSelector(
    (state) => state.weather.windsAloftUpdated,
  );

  return (
    <>
      <DataListItem>
        <Label>Data last fetched</Label>
        <div
          css={{
            color:
              windsAloftUpdated &&
              Math.abs(
                differenceInMinutes(new Date(windsAloftUpdated), new Date()),
              ) > 30
                ? "red"
                : undefined,
          }}
        >
          {windsAloftUpdated
            ? capitalize(
                formatDistanceToNow(new Date(windsAloftUpdated), {
                  addSuffix: true,
                }),
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
