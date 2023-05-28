import { getTimezoneOffsetLabel } from "./date";

describe("getTimezoneOffsetLabel", () => {
  it("returns the correct offset label for US/Eastern", () => {
    const result = getTimezoneOffsetLabel(
      "US/Eastern",
      new Date("2023-05-28T15:55:26.713Z")
    );
    expect(result).toBe("UTC-4");
  });

  it("returns the correct offset label for Atlantic/Reykjavik", () => {
    const result = getTimezoneOffsetLabel(
      "Atlantic/Reykjavik",
      new Date("2023-05-28T15:55:26.713Z")
    );
    expect(result).toBe("UTC+0");
  });

  it("returns the correct offset label for Asia/Tokyo", () => {
    const result = getTimezoneOffsetLabel(
      "Asia/Tokyo",
      new Date("2023-05-28T15:55:26.713Z")
    );
    expect(result).toBe("UTC+9");
  });

  it("returns the correct offset label for Europe/Amsterdam", () => {
    const result = getTimezoneOffsetLabel(
      "Europe/Amsterdam",
      new Date("2023-05-28T15:55:26.713Z")
    );
    expect(result).toBe("UTC+2");
  });

  it("returns the correct offset label for Australia/Adelaide", () => {
    const result = getTimezoneOffsetLabel(
      "Australia/Adelaide",
      new Date("2023-05-28T15:55:26.713Z")
    );
    expect(result).toBe("UTC+09:30");
  });
});
