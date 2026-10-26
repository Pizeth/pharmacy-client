import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ResourceTableCreateButton } from "./ResourceTableCreateButton";
it.each(["light", "dark"] as const)("uses pill corners and white text in %s mode", mode => {
 const onClick = jest.fn();
 render(<ThemeProvider theme={createTheme({ palette: { mode } })}><ResourceTableCreateButton color="secondary" onClick={onClick}>Create record</ResourceTableCreateButton></ThemeProvider>);
 const button = screen.getByRole("button", { name: "Create record" });
 expect(getComputedStyle(button).borderRadius).toBe("999px"); expect(getComputedStyle(button).color).toBe("rgb(255, 255, 255)");
 expect(getComputedStyle(button).boxShadow).toContain("inset");
 expect(screen.getByTestId("AddRoundedIcon")).toBeInTheDocument();
 fireEvent.click(button); expect(onClick).toHaveBeenCalledTimes(1);
});
