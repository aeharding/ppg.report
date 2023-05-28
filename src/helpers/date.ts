import { isWithinInterval as _isWithinInterval } from "date-fns";

export const isWithinInterval: typeof _isWithinInterval = (...args) => {
  try {
    return _isWithinInterval(...args);
  } catch (e) {
    if (e instanceof RangeError) return false;

    throw e;
  }
};

export function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}

const locale: string = "en-US";
const us_re: RegExp = /(\d+).(\d+).(\d+),?\s+(\d+).(\d+)(.(\d+))?/;

const format_options: Intl.DateTimeFormatOptions = {
  timeZone: "UTC",
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const utc_f: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  locale,
  format_options
);

function parseDate(date_str: string): number[] {
  date_str = date_str.replace(/[\u200E\u200F]/g, "");
  return [].slice.call(us_re.exec(date_str), 1).map(Math.floor);
}

function diffMinutes(d1: number[], d2: number[]): number {
  let day: number = d1[1] - d2[1];
  let hour: number = d1[3] - d2[3];
  let min: number = d1[4] - d2[4];

  if (day > 15) day = -1;
  if (day < -15) day = 1;

  return 60 * (24 * day + hour) + min;
}

export default function getTimezoneOffset(tz_str: string, date: Date): number {
  format_options.timeZone = tz_str;

  const loc_f: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    locale,
    format_options
  );

  return diffMinutes(
    parseDate(utc_f.format(date)),
    parseDate(loc_f.format(date))
  );
}

export function getTimezoneOffsetLabel(
  timeZone: string,
  date = new Date()
): string {
  const offset = getTimezoneOffset(timeZone, date);
  const offsetSign = -offset < 0 ? "-" : "+";
  const offsetHours = Math.floor(Math.abs(offset) / 60).toString();
  const offsetMinutes = Math.abs(offset) % 60;

  if (offsetMinutes === 0) {
    return `UTC${offsetSign}${offsetHours}`;
  } else {
    const formattedOffsetHours = offsetHours.padStart(2, "0");
    const formattedOffsetMinutes = offsetMinutes.toString().padStart(2, "0");
    return `UTC${offsetSign}${formattedOffsetHours}:${formattedOffsetMinutes}`;
  }
}
