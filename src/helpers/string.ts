import startCase from "lodash/startCase";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertTitleCaseToSpaces(input: string): string {
  const result = startCase(input)
    .split(" ")
    .map((word) => {
      if (`${word.charAt(0)}${word.slice(1).toLowerCase()}` === word)
        return word.toLowerCase();
      return word;
    })
    .join(" ");

  return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
}
