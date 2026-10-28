import { render, screen, within } from "@testing-library/react";
import { SiteBreadcrumbs } from "@/components/layouts/SiteBreadcrumbs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleRecordPage } from "./roles/RoleRecordPage";
import { UserRecordPage } from "./users/UserRecordPage";
import { SocialProviderRecordPage } from "./social/pages/SocialProviderRecordPage";
import { TranslationKeyRecordPage } from "../i18n/translation-keys/pages/TranslationKeyRecordPage";
import { rolesApi } from "./roles/api";
import { usersApi } from "./users/api";
import { socialApi } from "./social/api";
import { readTranslationKey } from "../i18n/translation-keys/api";
import { applicationRole, roleMetadata } from "./roles/role.test-fixtures";
import { useAdminAccess } from "./social/useAdminAccess";
import type { ReactNode } from "react";
jest.mock("next/navigation", () => ({ usePathname: () => "/admin/users/12", useRouter: () => ({ push: jest.fn() }) }));
jest.mock("./social/useAdminAccess", () => ({ useAdminAccess: jest.fn() }));
jest.mock("@/components/layouts/ResourcePage", () => ({ ResourcePage: ({ title, children }: { title: string; children: ReactNode }) => <><h1>{title}</h1>{children}</> }));
jest.mock("../i18n/translation-keys/api", () => ({ readTranslationKey: jest.fn() }));
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
beforeEach(() => {
  jest.spyOn(socialApi, "profiles").mockResolvedValue([]);
  jest.spyOn(usersApi, "get").mockResolvedValue({ id: "12", name: "Jane", email: "jane@example.com", createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-28T00:00:00Z" });
  jest.mocked(useAdminAccess).mockReturnValue({ allowed: true, isLoading: false } as ReturnType<typeof useAdminAccess>);
});
afterEach(() => { jest.restoreAllMocks(); jest.clearAllMocks(); });
function mount(content: ReactNode) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{content}</QueryClientProvider>);
}
it("loads role details with permission grants and a dedicated edit link", async () => {
  jest.spyOn(rolesApi, "metadata").mockResolvedValue(roleMetadata);
  jest.spyOn(rolesApi, "get").mockResolvedValue(applicationRole);
  mount(<RoleRecordPage id="5" />);
  expect(await screen.findByText("Edit application content")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", "/admin/roles/edit/5");
  expect(screen.getByText("TranslationKey")).toBeInTheDocument();
});
it("rejects role detail access without requesting the protected record", async () => {
  jest.spyOn(rolesApi, "metadata").mockResolvedValue({ ...roleMetadata, canManage: false });
  const get = jest.spyOn(rolesApi, "get");
  mount(<RoleRecordPage id="5" />);
  expect(await screen.findByText("Super administrator access is required.")).toBeInTheDocument();
  expect(get).not.toHaveBeenCalled();
  expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
});
it("renders account, role and profile data from the user detail endpoint", async () => {
  const detail = jest.spyOn(usersApi, "detail").mockResolvedValue({ id: "12", name: "Jane", email: "jane@example.com", username: "jane", userRole: null, profile: { firstName: "Jane", lastName: "Doe", phone: "012345678" }, accounts: [{ id: "a", providerId: "google" }] });
  mount(<UserRecordPage id="12" />);
  expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  expect(detail).toHaveBeenCalledWith("12", expect.any(AbortSignal));
  expect(screen.getByText("Google")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", "/admin/users/edit/12");
});
it("renders a missing-provider error instead of an empty detail page", async () => {
  jest.spyOn(socialApi, "providers").mockResolvedValue([]);
  mount(<SocialProviderRecordPage id="9" />);
  expect(await screen.findByText("Social provider not found.")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
});
it("renders read-only translation metadata and every stored locale", async () => {
  jest.mocked(readTranslationKey).mockResolvedValue({ id: 4, key: "saved_key", description: "Saved description", categoryId: 1,
    createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-27T00:00:00Z", translationCategory: { id: 1, name: "Common", description: null },
    translations: [{ id: 1, locale: "en", value: "Saved text", createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-27T00:00:00Z" }] });
  mount(<TranslationKeyRecordPage id="4" />);
  expect(await screen.findByText("Saved text")).toBeInTheDocument();
  expect(screen.getByText("Common")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", "/admin/i18n/edit/4");
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
it("does not request an invalid translation key ID", () => {
  mount(<TranslationKeyRecordPage id="bad-id" />);
  expect(screen.getByText("Invalid translation key ID.")).toBeInTheDocument();
  expect(readTranslationKey).not.toHaveBeenCalled();
});

it("loads assigned accounts through the role filter and links to full user details", async () => {
  jest.spyOn(rolesApi, "metadata").mockResolvedValue(roleMetadata);
  jest.spyOn(rolesApi, "get").mockResolvedValue({ ...applicationRole, userCount: 1 });
  const users = jest.spyOn(usersApi, "list").mockResolvedValue({ users: [{ id: "42", name: "Role member", email: "member@example.com" }], total: 1 });
  mount(<RoleRecordPage id="5" />);
  expect(await screen.findByText("member@example.com")).toBeInTheDocument();
  expect(users).toHaveBeenCalledWith(0, 5, "", [{ id: "role", value: "5" }], [], expect.any(AbortSignal));
  expect(screen.getByRole("link", { name: "View user" })).toHaveAttribute("href", "/admin/users/42");
  expect(screen.queryByRole("link", { name: "Delete role" })).not.toBeInTheDocument();
});
it("shows the provider's real configuration and timestamps without inventing usage counts", async () => {
  jest.spyOn(socialApi, "providers").mockResolvedValue([{ id: 9, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: false, createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-28T00:00:00Z" }]);
  mount(<SocialProviderRecordPage id="9" />);
  expect(await screen.findByRole("region", { name: "Provider configuration" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Availability & usage" })).toBeInTheDocument();
  expect(screen.getByText(/does not report a usage count/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Visit website" })).toHaveAttribute("href", "https://t.me/");
});

it("shares the loaded user name with the shell breadcrumb without another detail request", async () => {
  const detail = jest.spyOn(usersApi, "detail").mockResolvedValue({ id: "12", name: "Jane Doe", email: "jane@example.com", accounts: [] });
  mount(<><SiteBreadcrumbs /><UserRecordPage id="12" /></>);
  const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(await within(nav).findByText("Jane Doe")).toHaveAttribute("aria-current", "page");
  expect(within(nav).queryByText("12")).not.toBeInTheDocument();
  expect(detail).toHaveBeenCalledTimes(1);
});

it("does not render internal record identifiers as detail facts", async () => {
  jest.spyOn(usersApi, "detail").mockResolvedValue({ id: "12", name: "Jane", email: "jane@example.com", accounts: [{ id: "private-connection-id", providerId: "google" }], userRole: { id: 2, name: "ADMIN" } });
  const { container } = mount(<UserRecordPage id="12" />);
  expect(await screen.findByRole("region", { name: "Account identity" })).toBeInTheDocument();
  expect(container).not.toHaveTextContent("private-connection-id");
  expect(screen.queryByText(/^(User|Connection|Application role) ID$/)).not.toBeInTheDocument();
});
