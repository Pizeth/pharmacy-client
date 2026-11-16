import { formatAdminDate } from "./adminDate";
it("uses readable month names with Cambodia midnight rollover", () => {
  expect(formatAdminDate("2026-10-27T20:05:00Z")).toBe("28 October 2026");
  expect(formatAdminDate("2026-01-02T03:04:00Z", false)).toBe("2 January 2026");
});
it("handles absent and invalid timestamps without throwing", () => {
  expect(formatAdminDate(null)).toBe("—");
  expect(formatAdminDate("invalid")).toBe("—");
});

it("retains time only when explicitly requested", () => {
  expect(formatAdminDate("2026-10-26T08:11:00Z", true)).toBe("26 October 2026 15:11");
});
