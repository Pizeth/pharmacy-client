import { LoginValues, RegisterValues } from "@/schema/auth.schema";
import { useLogin, useRegister } from "@refinedev/core";

export const useAuthFlow = () => {
  const { mutate: login } = useLogin();
  const { mutate: register } = useRegister();

  const signin = (data: LoginValues) => login(data);

  const signup = (data: RegisterValues) =>
    register(data, {
      onSuccess: (data) => {
        if (!data.success) {
          // handle error
          console.error("Registration failed:", data.error);
          return;
        }
        // Auto-login after successful registration
        login({
          identifier: data.email, // or values.username, depending on the backend
          password: data.password,
        });
      },
    });

  const reset = async (email: string) => {
    // call API
  };

  //   const verify = async (token) => {
  //     // call API
  //   };

  //   const twoFactor = async (code) => {
  //     // call API
  //   };

  return {
    signin,
    signup,
    reset,
    // verify,
    // twoFactor,
  };
};
