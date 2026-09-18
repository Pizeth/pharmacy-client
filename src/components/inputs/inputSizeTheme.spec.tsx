import { render, screen } from "@testing-library/react";
import { Person, Password as PasswordIcon } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FormProvider, useForm } from "react-hook-form";

import { PasswordField } from "./passwordfield";
import { TextField } from "./textfield";

interface Values {
  identifier: string;
  password: string;
}

const theme = createTheme({
  components: {
    RazethTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
        margin: "dense",
        fullWidth: true,
      },
    },

    RazethPasswordField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
        margin: "dense",
        fullWidth: true,
      },
    },
  },
});

function Fixture() {
  const form = useForm<Values>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...form}>
        <TextField
          name="identifier"
          label="Username or Email"
          iconStart={<Person />}
        />

        <PasswordField
          name="password"
          label="Password"
          iconStart={<PasswordIcon />}
        />
      </FormProvider>
    </ThemeProvider>
  );
}

it("keeps text and password inputs on the same small-size geometry", () => {
  render(<Fixture />);

  const username = screen.getByRole("textbox", {
    name: "Username or Email",
  });

  const password = screen.getByLabelText("Password");

  const usernameRoot = username.closest(".MuiInputBase-root");
  const passwordRoot = password.closest(".MuiInputBase-root");

  expect(usernameRoot).toHaveClass("MuiInputBase-sizeSmall");
  expect(passwordRoot).toHaveClass("MuiInputBase-sizeSmall");
});
