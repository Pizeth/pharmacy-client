import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AvatarContainer from "./AvatarContainer";
import AvatarHeader from "@/components/auth/avatar";
import DrawerToggle from "@/components/Navigations/Navigation/DrawerToggle";

function avatarTheme() {
  const theme = createTheme({
    cssVariables: true,
    palette: { customShadows: {
      circleWell: "inset 2px 2px 4px black", neumorphic: "2px 2px 4px black",
      inset: "none", dataTableCard: "none", dataTableInset: "none",
    } },
    components: { RazethAvatarContainer: {
      defaultProps: { alt: "Anonymous", fallback: "A" },
      styleOverrides: { root: { width: "96px" } },
    } },
  });
  Object.assign(theme, { custom: { sideImage: {
    circlePulseSequence: [0, 1], circlePulseDuration: "10s",
    animationBackground: { backgroundImage: "linear-gradient(red, blue)", backgroundSize: "200% 200%" },
  } } });
  return theme;
}
afterEach(() => jest.restoreAllMocks());

test("anonymous fallback keeps the shared animated frame and theme contract", () => {
  const { container } = render(<ThemeProvider theme={avatarTheme()}><AvatarContainer /></ThemeProvider>);
  expect(screen.getByRole("img", { name: "Anonymous" })).toHaveTextContent("A");
  expect(screen.queryByTestId("LocalPoliceOutlinedIcon")).not.toBeInTheDocument();
  expect(getComputedStyle(container.firstElementChild!).width).toBe("96px");
  expect(container.querySelector('[class*="RazethAvatarFrame-root"]')).toBeInTheDocument();
  expect(container.querySelector('[class*="RazethAvatarWrapper-root"]')).toBeInTheDocument();
});

test("image failures use the supplied fallback and keep the real role badge", () => {
  const loadingImage = document.createElement("img");
  const imageConstructor = jest.spyOn(window, "Image").mockImplementation(() => loadingImage);
  render(<ThemeProvider theme={avatarTheme()}><AvatarContainer src="/missing.jpg" alt="Member avatar" fallback="M" role="member" hoverIcon={<MenuIcon />} /></ThemeProvider>);
  expect(screen.getByText("member")).toBeInTheDocument();
  fireEvent.error(loadingImage);
  expect(screen.getByRole("img", { name: "Member avatar" })).toHaveTextContent("M");
  expect(screen.getByTestId("MenuIcon")).toBeInTheDocument();
});

test("auth and navbar adapters compose one shared frame and retain their content", () => {
  const { container } = render(<ThemeProvider theme={avatarTheme()}>
    <AvatarHeader title="Welcome" avatarIcon={<span>Auth emblem</span>} />
    <DrawerToggle><img src="/logo.svg" alt="Navigation logo" /></DrawerToggle>
  </ThemeProvider>);
  expect(screen.getByText("Auth emblem")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Welcome" })).toBeInTheDocument();
  expect(screen.getByAltText("Navigation logo")).toBeInTheDocument();
  expect(screen.getByTestId("MenuIcon")).toBeInTheDocument();
  expect(container.querySelectorAll('[class*="RazethAvatarFrame-root"]')).toHaveLength(2);
  const frames = container.querySelectorAll('[class*="RazethAvatarFrame-root"]');
  expect(getComputedStyle(frames[0]).boxShadow).not.toBe("none");
  expect(getComputedStyle(frames[1]).boxShadow).toBe("none");
  expect(getComputedStyle(frames[1]).backgroundColor).toBe("rgba(0, 0, 0, 0)");
  expect(getComputedStyle(frames[1].parentElement!).boxShadow).toContain("20px 10px");
});

test("soft glow is independent of neumorphism and respects explicit overrides", () => {
  const theme = avatarTheme();
  theme.components!.RazethAvatarContainer!.defaultProps!.softGlow = true;
  const { container } = render(<ThemeProvider theme={theme}>
    <AvatarContainer neumorphic={false} />
    <AvatarContainer neumorphic={false} softGlow={false} />
  </ThemeProvider>);
  const frames = container.querySelectorAll('[class*="RazethAvatarFrame-root"]');
  expect(getComputedStyle(frames[0]).boxShadow).toBe("none");
  expect(getComputedStyle(frames[0].parentElement!).boxShadow).toContain("20px 10px");
  expect(getComputedStyle(frames[1].parentElement!).boxShadow).not.toContain("20px 10px");
});

test("theme defaults can disable neumorphism and an explicit prop can enable it", () => {
  const theme = avatarTheme();
  theme.components!.RazethAvatarContainer!.defaultProps!.neumorphic = false;
  const { container } = render(<ThemeProvider theme={theme}>
    <AvatarContainer />
    <AvatarContainer neumorphic />
  </ThemeProvider>);
  const frames = container.querySelectorAll('[class*="RazethAvatarFrame-root"]');
  expect(getComputedStyle(frames[0]).boxShadow).toBe("none");
  expect(getComputedStyle(frames[1]).boxShadow).not.toBe("none");
  expect(container.querySelectorAll('[class*="RazethAvatarWrapper-root"]')).toHaveLength(2);
});
