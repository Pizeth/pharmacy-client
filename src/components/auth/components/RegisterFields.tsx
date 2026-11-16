"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Password, Email, Person } from "@mui/icons-material";
import TextField from "@/components/inputs/textfield";
import PasswordField from "@/components/inputs/passwordfield";
import FullName from "@/components/icons/fullName";
import { PasswordArea } from "../styles/authForm.style";

const ConfirmPasswordField = () => {
  const { control } = useFormContext();
  const passwordValue: string = useWatch({ control, name: "password" }) ?? "";
  return (<PasswordField name="confirmPassword" label="Confirm Password" iconStart={<Password />} required matchPassword={passwordValue} />);
};
export const RegisterFields = () => (<>
  <TextField name="name" label="Full Name" required iconStart={<FullName />} fullWidth />
  <TextField name="email" label="Email Address" type="email" required iconStart={<Email />} fullWidth />
  <TextField name="username" label="Username" required iconStart={<Person />} fullWidth />
  <PasswordArea>
    <PasswordField name="password" label="Password" iconStart={<Password />} required strengthMeter />
    <ConfirmPasswordField />
  </PasswordArea>
</>);
