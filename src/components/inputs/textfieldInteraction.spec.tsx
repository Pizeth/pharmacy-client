import { fireEvent, render, screen } from "@testing-library/react";

import { FormProvider, useForm } from "react-hook-form";

import { KeyOutlined } from "@mui/icons-material";

import { TextField } from "./textfield";

interface Values {
  key: string;
}

function Fixture() {
  const form = useForm<Values>({
    defaultValues: {
      key: "",
    },
  });

  return (
    <FormProvider {...form}>
      <TextField name="key" label="Key" iconStart={<KeyOutlined />} />
    </FormProvider>
  );
}

it("does not shrink the label merely because a start icon exists", () => {
  render(<Fixture />);

  const input = screen.getByRole("textbox", {
    name: "Key",
  });

  const label = document.querySelector(`label[for="${input.id}"]`);

  expect(label).not.toBeNull();

  expect(label).toHaveAttribute("data-shrink", "false");
});

it("shrinks the label on focus and keeps it shrunk when a value exists", () => {
  render(<Fixture />);

  const input = screen.getByRole("textbox", {
    name: "Key",
  });

  const label = document.querySelector(`label[for="${input.id}"]`);

  fireEvent.focus(input);

  expect(label).toHaveAttribute("data-shrink", "true");

  fireEvent.change(input, {
    target: {
      value: "auth_login",
    },
  });

  fireEvent.blur(input);

  expect(label).toHaveAttribute("data-shrink", "true");
});
