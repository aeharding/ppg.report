import { Fragment, ReactNode } from "react";
import { GlossaryTerm } from "../../../../../services/weather";
import Definition from "./Definition";

export function generateGlossary(section: string, glossary: GlossaryTerm[]) {
  if (!glossary) return <></>;

  const result: ReactNode[] = [section];
  const resultLwr: ReactNode[] = [section.toLowerCase()];

  glossary.forEach(({ term, lwrTerm, definition }) => {
    for (let i = 0; i < resultLwr.length; i++) {
      const partLwr = resultLwr[i];
      const part = result[i];

      if (typeof part !== "string") continue;
      if (typeof partLwr !== "string") continue;

      let location: number;
      location = partLwr.search(lwrTerm);

      if (location === -1) continue;

      const preceding = part.charAt(location - 1);
      const following = part.charAt(location + term.length);

      if (location !== 0 && !/\s|\./.test(preceding)) continue;
      if (!/\s|\.|,/.test(following)) continue;

      result.splice(
        i,
        1,
        part.slice(0, location),
        <Definition term={term} definition={definition}>
          {part.slice(location, location + term.length)}
        </Definition>,
        part.slice(location + term.length)
      );

      resultLwr.splice(
        i,
        1,
        partLwr.slice(0, location),
        <></>, // placeholder/not needed for rendering
        partLwr.slice(location + term.length)
      );
      i = i + 1;
    }
  });

  return (
    <>
      {result.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </>
  );
}
