import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { SocialButton } from "./socialButton";

it("renders a disabled social placeholder as a button without a dead link", () => {
  render(<ThemeProvider theme={createTheme()}>
    <SocialButton buttonType="iconButton" label="Meta (ឆាប់ៗនេះ)" icon={<span>M</span>} disabled />
  </ThemeProvider>);
  expect(screen.getByRole("button", { name: "Meta (ឆាប់ៗនេះ)" })).toBeDisabled();
  expect(screen.queryByRole("link", { name: /Meta/ })).not.toBeInTheDocument();
  expect(document.querySelector('a[href="#"]')).not.toBeInTheDocument();
});

it("preserves the active social destination and an accessible name", () => {
  render(<ThemeProvider theme={createTheme()}>
    <SocialButton buttonType="iconButton" label="Telegram: Example" icon={<span>T</span>}
      href="https://t.me/example" />
  </ThemeProvider>);
  expect(screen.getByRole("link", { name: "Telegram: Example" })).toHaveAttribute("href", "https://t.me/example");
  expect(screen.getByRole("link", { name: "Telegram: Example" })).toHaveAttribute("rel", "noopener noreferrer");
});
