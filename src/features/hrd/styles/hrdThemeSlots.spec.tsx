import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { HrdHomePage } from "../pages/home/HrdHomePage";
import { HrdContactPage } from "../pages/contact/HrdContactPage";
import { HrdAboutPage } from "../pages/about/HrdAboutPage";

const theme = createTheme({
  components: {
    RazethHrd: {
      styleOverrides: {
        homeFeature: { borderTop: "7px solid rgb(1, 2, 3)" },
        contactLocation: { borderTop: "7px solid rgb(1, 2, 3)" },
        aboutPanel: { borderTop: "7px solid rgb(1, 2, 3)" },
      },
    },
  },
});

it.each([
  ["home", <HrdHomePage />, "region", "ព័ត៌មានសំខាន់"],
  ["contact", <HrdContactPage />, "region", "ទីតាំងនាយកដ្ឋាន"],
  ["about", <HrdAboutPage section="overview" />, "article", "ព័ត៌មានសង្ខេបនាយកដ្ឋាន"],
] as const)("allows the theme to override the %s presentation slot", (_name, page, role, label) => {
  render(<ThemeProvider theme={theme}>{page}</ThemeProvider>);
  const element = screen.getByRole(role, { name: label });
  expect(element.className).toContain("RazethHrd-");
  expect(element).toHaveStyle({ borderTopWidth: "7px", borderTopColor: "rgb(1, 2, 3)" });
});
