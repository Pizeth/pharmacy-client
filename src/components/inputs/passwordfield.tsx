// RHFPasswordField.tsx
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "./textfield";

export const PasswordField = ({ name, control, label }: any) => {
  const [show, setShow] = useState(false);

  return (
    <TextField
      name={name}
      control={control}
      label={label}
      type={show ? "text" : "password"}
      iconEnd={
        <IconButton onClick={() => setShow((p) => !p)}>
          {show ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      }
    />
  );
};

export default PasswordField;
