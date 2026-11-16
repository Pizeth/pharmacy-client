import { ThemeProvider, createTheme } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { TrackingDateTimeField } from "./TrackingDateTimeField";
function Fixture() {
  const form = useForm({ defaultValues: { date: "2026-10-27T14:35" } });
  const value = useWatch({ control: form.control, name: "date" });
  return <FormProvider {...form}><TrackingDateTimeField name="date" label="Received at" /><output aria-label="Stored date">{value}</output></FormProvider>;
}
it("renders day-month-year and retains an accessible calendar picker", () => {
  render(<Fixture />);
  expect(screen.getByLabelText("Received at")).toHaveValue("27-10-2026 14:35");
  fireEvent.click(screen.getByRole("button", { name: /Choose date/ }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
it("converts typed day-month-year input back into the ISO form value", () => {
  render(<Fixture />);
  fireEvent.change(screen.getByLabelText("Received at"), { target: { value: "05-11-2026 09:15" } });
  expect(screen.getByLabelText("Stored date")).toHaveTextContent("2026-11-05T09:15");
});

it("uses the shared input size configured by the application theme", () => {
  const theme = createTheme({ components: { RazethTextField: { defaultProps: { size: "small" } } } });
  render(<ThemeProvider theme={theme}><Fixture /></ThemeProvider>);
  expect(screen.getByLabelText("Received at").closest(".MuiFormControl-root")).toHaveAttribute("data-size", "small");
});
