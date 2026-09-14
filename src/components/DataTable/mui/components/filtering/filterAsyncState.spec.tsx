import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableSelectFilter } from "./DataTableSelectFilter";
import { DataTableTextFilter } from "./DataTableTextFilter";
import { DataTableNumberFilter } from "./DataTableNumberFilter";
import { DataTableNumberRangeFilter } from "./DataTableNumberRangeFilter";
import { DataTableBooleanFilter } from "./DataTableBooleanFilter";

it("closes an open menu during refresh and keeps it closed after recovery", () => {
  const props = {
    label: "Category", value: 2, options: [{ label: "Auth", value: 2 }],
    onChange: jest.fn(), onClear: jest.fn(),
  };
  const { rerender } = render(<DataTableSelectFilter {...props} />);
  fireEvent.mouseDown(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  rerender(<DataTableSelectFilter {...props} loading />);
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  rerender(<DataTableSelectFilter {...props} />);
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  expect(props.onChange).not.toHaveBeenCalled();
  expect(props.onClear).not.toHaveBeenCalled();
});

it("preserves a missing committed value across loading, failure, and recovery; All clears", () => {
  const onChange = jest.fn();
  const onClear = jest.fn();
  const props = { label: "Category", value: 2, onChange, onClear };
  const { rerender } = render(<DataTableSelectFilter {...props} options={[]} loading />);
  expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("status")).toHaveTextContent("Loading options");
  expect(screen.getByRole("combobox")).toHaveTextContent("2");
  rerender(<DataTableSelectFilter {...props} options={[]} errorMessage="Options unavailable" />);
  expect(screen.getByRole("alert")).toHaveTextContent("Options unavailable");
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true");
  expect(onClear).not.toHaveBeenCalled();
  expect(onChange).not.toHaveBeenCalled();
  rerender(<DataTableSelectFilter {...props} options={[{ label: "Auth", value: 2 }]} />);
  expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("combobox")).toHaveTextContent("Auth");
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "All" }));
  expect(onClear).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
});

it("disables all leaf editor inputs while leaving an independent select enabled", () => {
  const callbacks = { onChange: jest.fn(), onClear: jest.fn() };
  render(<>
    <DataTableTextFilter {...callbacks} disabled label="Text" value="" />
    <DataTableNumberFilter {...callbacks} disabled label="Number" value={undefined} />
    <DataTableNumberRangeFilter {...callbacks} disabled label="Range" value={[undefined, undefined]} />
    <DataTableBooleanFilter {...callbacks} disabled label="Boolean" value={undefined} />
    <DataTableSelectFilter {...callbacks} label="Locale" value={undefined} options={[]} />
  </>);
  for (const label of ["Text", "Number", "Range minimum", "Range maximum"]) {
    expect(screen.getByLabelText(label)).toBeDisabled();
  }
  expect(screen.getByRole("combobox", { name: "Boolean" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("combobox", { name: "Locale" })).not.toHaveAttribute("aria-disabled", "true");
});
