import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { PermissionTypeInput } from "./PermissionTypeInput";

jest.mock("react-admin", () => ({
  SelectInput: ({ disabled }: { disabled: boolean }) => (
    <select aria-label="Permission type" disabled={disabled} />
  ),
}));

function CurrentValue() {
  const { control } = useFormContext();
  const value = useWatch({ control, name: "permissionType" });
  return <output aria-label="Stored permission">{value}</output>;
}

function Fixture({ category }: { category: string }) {
  const form = useForm({ defaultValues: { category, permissionType: "annual" } });
  return (
    <FormProvider {...form}>
      <PermissionTypeInput />
      <CurrentValue />
      <button onClick={() => form.setValue("category", "Other")}>Change category</button>
    </FormProvider>
  );
}

it("preserves the value for leave requests and clears it when the category changes", () => {
  render(<Fixture category="សំណើសុំច្បាប់ឈប់សម្រាក" />);
  expect(screen.getByRole("combobox")).toBeEnabled();
  expect(screen.getByLabelText("Stored permission")).toHaveTextContent("annual");
  fireEvent.click(screen.getByRole("button", { name: "Change category" }));
  expect(screen.getByRole("combobox")).toBeDisabled();
  expect(screen.getByLabelText("Stored permission")).toBeEmptyDOMElement();
});

it("clears an inapplicable initial value without requiring an outer form context", () => {
  render(<Fixture category="Other" />);
  expect(screen.getByRole("combobox")).toBeDisabled();
  expect(screen.getByLabelText("Stored permission")).toBeEmptyDOMElement();
});
