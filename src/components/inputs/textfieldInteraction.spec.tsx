import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { AccountBox, KeyOutlined } from "@mui/icons-material";
import { TextField } from "./textfield";
// import ControlledInput from "./controlledInput";
// import userEvent from "@testing-library/user-event";

interface Values {
  key: string;
  officialId: string;
}

// interface TestFormValues {
//   email: string;
// }

function Fixture() {
  const form = useForm<Values>({
    defaultValues: {
      key: "",
      officialId: "",
    },
  });

  return (
    <FormProvider {...form}>
      <TextField name="key" label="Key" iconStart={<KeyOutlined />} />
      <TextField
        name="officialId"
        label="Official ID"
        iconStart={<AccountBox />}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            pattern: "[0-9]*",
          },
        }}
      />
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

it("forwards caller htmlInput slot props to the native input", () => {
  render(<Fixture />);

  const input = screen.getByRole("textbox", {
    name: "Official ID",
  });

  expect(input).toHaveAttribute("inputmode", "numeric");
  expect(input).toHaveAttribute("pattern", "[0-9]*");
});

// function ControlledEmailHarness(): React.JSX.Element {
//   const { control } = useForm<TestFormValues>({
//     defaultValues: {
//       email: "",
//     },
//   });

//   return (
//     <ControlledInput
//       control={control}
//       name="email"
//       type="email"
//       label="Email"
//       slotProps={{
//         htmlInput: {
//           dir: "ltr",
//         },
//       }}
//     />
//   );
// }

// it("preserves character order in an RHF-controlled email input", async () => {
//   const user = userEvent.setup();

//   render(<ControlledEmailHarness />);

//   const input = screen.getByRole("textbox", {
//     name: "Email",
//   });

//   await user.type(input, "Apple");

//   expect(input).toHaveValue("Apple");
// });

// it("keeps the caret after the inserted text", async () => {
//   const user = userEvent.setup();

//   render(<ControlledEmailHarness />);

//   const input = screen.getByRole("textbox", {
//     name: "Email",
//   }) as HTMLInputElement;

//   await user.type(input, "Apple");

//   expect(input.value).toBe("Apple");
//   expect(input.selectionStart).toBe(5);
//   expect(input.selectionEnd).toBe(5);
// });
