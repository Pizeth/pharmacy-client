import { ROUTE_NAV_MAP } from "@/configs/navConfig";

export interface SiteBreadcrumb {
  readonly href: string;
  readonly label: string;
}
const navigation = Object.values(ROUTE_NAV_MAP).flatMap(items => items.flatMap(item => [item, ...(item.children ?? [])]));
const labels: Record<string, string> = {
  users: "Users", roles: "Roles", admin: "Administration", dashboard: "Dashboard", "social-provider": "Social providers",
  i18n: "Translations", documents: "Documents", login: "Sign in", signup: "Sign up",
  "verify-id": "Verify identity", "forgot-password": "Forgot password", "reset-password": "Reset password",
  create: "Create", edit: "Edit", delete: "Delete", about: "About", contact: "Contact",
};
const recordResources: Record<string, { singular: string; fallback: string }> = {
  users: { singular: "user", fallback: "User profile" }, roles: { singular: "role", fallback: "Role details" },
  "social-provider": { singular: "social provider", fallback: "Social provider details" },
  i18n: { singular: "translation key", fallback: "Translation key details" }, documents: { singular: "document", fallback: "Document tracking" },
};
function labelFor(segment: string) {
  if (labels[segment]) return labels[segment];
  let decoded = segment;
  try { decoded = decodeURIComponent(segment); } catch { /* Preserve malformed route text without crashing navigation. */ }
  return decoded.replace(/[-_]/g, " ").replace(/\b\p{L}/gu, letter => letter.toUpperCase());
}

/** Only emit real ancestor destinations; edit/delete containers are not pages. */
export function getSiteBreadcrumbs(pathname: string): readonly SiteBreadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: SiteBreadcrumb[] = [{ href: "/", label: "Home" }];
  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    let href = `/${segments.slice(0, index + 1).join("/")}`;
    if ((segment === "edit" || segment === "delete") && segments[index + 1]) {
      href = `/${segments.slice(0, index + 2).join("/")}`;
      const recordId = segments[++index];
      const resource = segments[0] === "admin" ? recordResources[segments[1]] : undefined;
      crumbs.push({ href, label: resource ? `${segment === "delete" && segments[1] === "documents" ? "Archive" : labelFor(segment)} ${resource.singular}` : `${labelFor(segment)} #${labelFor(recordId)}` });
      continue;
    }
    crumbs.push({
      href: href === "/admin" ? "/admin/dashboard" : href,
      label: segments[0] === "admin" && recordResources[segments[1]] && index === 2 && segment !== "create"
        ? recordResources[segments[1]].fallback
        : segment === "admin" ? labels.admin : navigation.find(item => item.href === href)?.label ?? labelFor(segment),
    });
  }
  return crumbs;
}
