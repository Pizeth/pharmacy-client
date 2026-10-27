import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { AccountBox, KeyOutlined } from "@mui/icons-material";
import { TextField } from "./textfield";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserRound } from "lucide-react";
// import ControlledInput from "./controlledInput";
// import userEvent from "@testing-library/user-event";

interface Values {
  key: string;
  officialId: string;
}

function DateFixture({ type }: { type: string }) {
  const form = useForm({ defaultValues: { date: "" } });
  return <FormProvider {...form}><TextField name="date" label="Optional date" type={type} /></FormProvider>;
}

it.each(["date", "datetime-local", "month", "time", "week"])("keeps an empty %s label above the native date hint", type => {
  render(<DateFixture type={type} />);
  const input = screen.getByLabelText("Optional date");
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label).toHaveAttribute("data-shrink", "true");
  fireEvent.focus(input);
  fireEvent.blur(input);
  expect(label).toHaveAttribute("data-shrink", "true");
});

function LucideFixture() {
  const form = useForm({ defaultValues: { name: "" } });
  return <ThemeProvider theme={createTheme({ palette: { primary: { main: "#123456" } } })}>
    <FormProvider {...form}><TextField name="name" label="Name" iconStart={<UserRound />} /></FormProvider>
  </ThemeProvider>;
}

it("lets Lucide start icons inherit the focused field color", () => {
  const { container } = render(<LucideFixture />);
  fireEvent.focus(screen.getByRole("textbox", { name: "Name" }));
  expect(container.querySelector(".lucide")?.closest(".MuiInputAdornment-root")).toHaveStyle({ color: "#123456" });
});

function MultilineFixture() {
  const form = useForm({ defaultValues: { centered: "", top: "", single: "" } });
  return <FormProvider {...form}>
    <TextField name="centered" label="Centered message" iconStart={<UserRound />} multiline minRows={5} />
    <TextField name="top" label="Top message" iconStart={<UserRound />} iconStartAlignment="top" multiline minRows={5} />
    <TextField name="single" label="Single line" iconStart={<UserRound />} iconStartAlignment="top" />
  </FormProvider>;
}

it("opts multiline start icons into first-line alignment while preserving the centered default", () => {
  render(<MultilineFixture />);
  const adornment = (name: string) => screen.getByRole("textbox", { name })
    .closest(".MuiInputBase-root")?.querySelector(".MuiInputAdornment-positionStart");

  expect(adornment("Centered message")).toHaveStyle({ alignSelf: "auto" });
  expect(adornment("Top message")).toHaveStyle({ alignSelf: "flex-start", marginTop: "0px" });
  expect(adornment("Single line")).toHaveStyle({ alignSelf: "auto" });

  const input = screen.getByRole("textbox", { name: "Top message" });
  fireEvent.focus(input);
  expect(document.querySelector(`label[for="${input.id}"]`)).toHaveAttribute("data-shrink", "true");
  expect(adornment("Top message")).toHaveStyle({ alignSelf: "flex-start" });
});

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
