import { formatAdminDate } from "./adminDate";
it("uses dd-MM-yyyy with Cambodia time, including midnight rollover", () => {
  expect(formatAdminDate("2026-10-27T20:05:00Z")).toBe("28-10-2026 03:05");
  expect(formatAdminDate("2026-01-02T03:04:00Z", false)).toBe("02-01-2026");
});
it("handles absent and invalid timestamps without throwing", () => {
  expect(formatAdminDate(null)).toBe("—");
  expect(formatAdminDate("invalid")).toBe("—");
});
