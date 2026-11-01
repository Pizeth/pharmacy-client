/** Dashboard presentation routing only; API authorization remains server-owned. */
export function isSuperAdminRole(role?: string | null): boolean {
  return (role ?? "").split(",").some(value =>
    ["sys-admin", "system-admin", "super-admin", "superadmin"].includes(
      value.trim().toLowerCase().replace(/[_\s]+/g, "-"),
    ),
  );
}

export function getDashboardDestination(role?: string | null): string {
  return isSuperAdminRole(role) ? "/admin/dashboard" : "/dashboard";
}
