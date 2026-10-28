/** Human-readable admin dates, resolved in Cambodia office time. */
export function formatAdminDate(value: string | Date | null | undefined, includeTime = false): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh", day: "numeric", month: "long", year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const } : {}),
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value ?? "";
  const day = `${part("day")} ${part("month")} ${part("year")}`;
  return includeTime ? `${day} ${part("hour")}:${part("minute")}` : day;
}
