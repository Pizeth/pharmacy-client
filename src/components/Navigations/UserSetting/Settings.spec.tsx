import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserMenu } from "./Settings";

const mockPush = jest.fn();
const mockLogout = jest.fn();
const mockClose = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock("@refinedev/core", () => ({ useLogout: () => ({ mutate: mockLogout, isPending: false }) }));
jest.mock("@/theme/effects/particle", () => ({ __esModule: true, default: () => null }));
jest.mock("@/configs/particleConfig", () => ({ __esModule: true, default: () => ({}) }));
jest.mock("@/components/effect/themes/themeToggle", () => ({ __esModule: true, default: () => <button>Toggle theme</button> }));
jest.mock("./AvatarContainer", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/CustomComponents/AvatarWrapper", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/CustomComponents/AvatarFrame", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));

const theme = createTheme({ cssVariables: true });
const identity = { name: "Test Member", email: "member@example.com", role: "member" };
function mount(authenticated: boolean, authLoading = false) {
  return render(<ThemeProvider theme={theme}><UserMenu open anchorEl={document.body} onClose={mockClose} authenticated={authenticated} authLoading={authLoading} data={identity} /></ThemeProvider>);
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue();
});
afterEach(() => jest.restoreAllMocks());

test("signed-out users see theme and Login without cached identity or account actions", () => {
  mount(false);
  expect(screen.getByRole("img", { name: "Guest avatar" })).toBeInTheDocument();
  expect(screen.queryByText(identity.name)).not.toBeInTheDocument();
  expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Login"));
  expect(mockPush).toHaveBeenCalledWith("/login");
  expect(mockLogout).not.toHaveBeenCalled();
});
test("authenticated users see real identity and Logout without fabricated storage", () => {
  mount(true);
  expect(screen.queryByRole("img", { name: "Guest avatar" })).not.toBeInTheDocument();
  expect(screen.getByText(identity.name)).toBeInTheDocument();
  expect(screen.getByText(identity.email)).toBeInTheDocument();
  expect(screen.getByText("Profile")).toBeInTheDocument();
  expect(screen.queryByText(/used of/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Logout"));
  expect(mockLogout).toHaveBeenCalledTimes(1);
});
test("guests can open the contact page and close the menu", () => {
  mount(false);
  fireEvent.click(screen.getByText("Contact us"));
  expect(mockClose).toHaveBeenCalledTimes(1);
  expect(mockPush).toHaveBeenCalledWith("/hrd/contact");
});
test("authentication loading prevents premature navigation", () => {
  mount(false, true);
  expect(screen.queryByRole("img", { name: "Guest avatar" })).not.toBeInTheDocument();
  expect(screen.getByText("Loading…").closest("li")).toHaveAttribute("aria-disabled", "true");
});
