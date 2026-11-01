import { getDashboardDestination } from "./dashboardDestination";

it.each(["SYS_ADMIN", "sys-admin", "System Admin", "super-admin", "superadmin", "user, SUPER_ADMIN"])("routes %s to administration", role => {
  expect(getDashboardDestination(role)).toBe("/admin/dashboard");
});
it.each([undefined, null, "", "user", "admin", "document-manager", "super-admin-assistant"])("keeps %s on the user dashboard", role => {
  expect(getDashboardDestination(role)).toBe("/dashboard");
});
