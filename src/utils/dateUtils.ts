import momentKH from "./momentKH";

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

const DEFAULT_TIME_FORMAT = "h:mmនាទី A";

const DEFAULT_LOCALE = "km-KH";
export const formatLocaleDate = (
  date: string | Date,
  locale = DEFAULT_LOCALE,
  options = DEFAULT_DATE_OPTIONS,
): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return locale === DEFAULT_LOCALE
    ? momentKH.format(momentKH.fromDate(date), "D M c")
    : date.toLocaleDateString(locale, options);
};

export const formatLocalTime = (
  date: string | Date,
  formatString = DEFAULT_TIME_FORMAT,
  locale = DEFAULT_LOCALE,
  options = DEFAULT_TIME_OPTIONS,
): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return locale === DEFAULT_LOCALE
    ? momentKH.formatTime(momentKH.fromDate(date), formatString)
    : date.toLocaleTimeString(locale, options);
  // : date.toLocaleDateString(locale, options);
};

export default formatLocaleDate;
