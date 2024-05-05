import { Fragment, ReactNode } from "react";
import { GlossaryTerm } from "../../../../../services/nwsWeather";
import Definition from "./Definition";

const SEPARATOR_REGEX = /\s|\.|,|'|"|\//;

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

      const locations = searchAll(partLwr, lwrTerm);

      for (const location of locations) {
        const preceding = part.charAt(location - 1);
        const following = part.charAt(location + term.length);

        if (location !== 0 && !SEPARATOR_REGEX.test(preceding)) continue;
        if (!SEPARATOR_REGEX.test(following)) continue;

        result.splice(
          i,
          1,
          part.slice(0, location),
          <Definition term={term} definition={definition}>
            {part.slice(location, location + term.length)}
          </Definition>,
          part.slice(location + term.length),
        );

        resultLwr.splice(
          i,
          1,
          partLwr.slice(0, location),
          <></>, // placeholder/not needed for rendering
          partLwr.slice(location + term.length),
        );
        i = i + 1;

        // We found a valid match, so bail out of locations array
        // (we'll circle back with new searchAll() call)
        break;
      }
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

/**
 * Like String.serch(), except will return array with all indexes where match found
 */
function searchAll(text: string, match: string): number[] {
  let part = text;
  const indexes: number[] = [];
  let offset = 0;

  while (true) {
    const index = part.search(match);

    if (index === -1) break;

    indexes.push(index + offset);
    offset += index + match.length;
    part = part.slice(index + match.length);
  }

  return indexes;
}
