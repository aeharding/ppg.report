import TableOfContents, { HelpSection } from "./TableOfContents";
import { useState } from "react";
import LapseRate from "./lapseRate/LapseRate";

export default function Help() {
  const [section, setSection] = useState<HelpSection | undefined>();

  if (!section) return <TableOfContents setSection={setSection} />;

  switch (section) {
    case "lapse":
      return <LapseRate />;
  }

  return <></>;
}
