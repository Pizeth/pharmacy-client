// AuthForm.tsx
import { useForm } from "react-hook-form";
import { Button, Stack } from "@mui/material";
import { useLogin } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginValues,
  RegisterValues,
} from "@/schema/auth.schema";
import TextField from "../inputs/textfield";
import PasswordField from "../inputs/textfield";
import authService from "@/services/auth.service";

export const AuthForm = ({
  mode = "login",
}: {
  mode: "login" | "register";
}) => {
  const isLogin = mode === "login";

  const schema = isLogin ? loginSchema : registerSchema;

  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(
      schema,
      // {
      //   async: true, // 🔥 enable async validation
      // }
    ),
    mode: "onChange",
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (values: any) => {
    if (isLogin) {
      login(values); // 🔥 uses your authProvider automatically
    } else {
      console.log("register", values);
      // call your signup API here
      await authService.register(values);
      login(values); //
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {!isLogin && (
          <TextField name="username" control={control} label="Username" />
        )}

        <TextField name="email" control={control} label="Email" />

        <PasswordField
          name="password"
          control={control}
          label="Password"
          type="password"
        />

        {!isLogin && (
          <PasswordField
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />
        )}

        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </Button>
      </Stack>
    </form>
  );
};
