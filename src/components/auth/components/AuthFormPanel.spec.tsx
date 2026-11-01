import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthFormPanel } from "./AuthFormPanel";

jest.mock("@/components/effect/themes/themeToggle", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/effect/backgrounds/particleHex", () => ({ __esModule: true, default: ({ children }: { children: ReactNode }) => <div>{children}</div> }));
jest.mock("../AuthErrorNotice", () => ({ AuthErrorNotice: () => null }));
jest.mock("../ui/authNavaigation", () => ({ __esModule: true, default: () => null }));
jest.mock("../ui/authForm", () => ({ __esModule: true, default: ({ forgotPasswordUrl, forgotPassword }: { forgotPasswordUrl: string; forgotPassword: string }) => <a href={forgotPasswordUrl}>{forgotPassword}</a> }));

const originalUrl = process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL;
afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL;
  else process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = originalUrl;
});
function mount(mode: "signin" | "signup" = "signin", theme = createTheme({ cssVariables: true })) {
  return render(<ThemeProvider theme={theme}>
    <AuthFormPanel mode={mode} onToggle={() => {}} enableToggle avatar={null} divider={null} social={null} />
  </ThemeProvider>);
}
it.each(["signin", "signup"] as const)("preserves the configured recovery URL in %s", mode => {
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = " https://accounts.example.com/recovery ";
  mount(mode);
  expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute("href", "https://accounts.example.com/recovery");
});
it("preserves themed recovery URL and label ahead of the environment fallback", () => {
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = "https://accounts.example.com/recovery";
  mount("signin", createTheme({ cssVariables: true, components: {
    RazethAuthForm: { defaultProps: { forgotPasswordUrl: " /custom-recovery ", forgotPassword: "Recover account" } },
  } }));
  expect(screen.getByRole("link", { name: "Recover account" })).toHaveAttribute("href", "/custom-recovery");
});
it("preserves a themed label while using the configured recovery URL", () => {
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = "https://accounts.example.com/recovery";
  mount("signin", createTheme({ cssVariables: true, components: {
    RazethAuthForm: { defaultProps: { forgotPassword: "Account recovery" } },
  } }));
  expect(screen.getByRole("link", { name: "Account recovery" })).toHaveAttribute("href", "https://accounts.example.com/recovery");
});
it.each([undefined, "", "  "])("offers real support instead of an absent recovery route when URL is %s", value => {
  if (value === undefined) delete process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL;
  else process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = value;
  mount();
  expect(screen.getByRole("link", { name: "Need sign-in help?" })).toHaveAttribute("href", "/hrd/contact");
});
it.each(["", "  "])("falls back to the environment when the themed URL is %j", forgotPasswordUrl => {
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = " https://accounts.example.com/recovery ";
  mount("signin", createTheme({ cssVariables: true, components: {
    RazethAuthForm: { defaultProps: { forgotPasswordUrl } },
  } }));
  expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute("href", "https://accounts.example.com/recovery");
});
it("offers support when both recovery URL sources are blank", () => {
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL = " ";
  mount("signin", createTheme({ cssVariables: true, components: {
    RazethAuthForm: { defaultProps: { forgotPasswordUrl: " " } },
  } }));
  expect(screen.getByRole("link", { name: "Need sign-in help?" })).toHaveAttribute("href", "/hrd/contact");
});
