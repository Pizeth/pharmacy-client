"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useRegister, type RefineError } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { resetAllValidationsAtom } from "@/Stores/validationStore";
import { beginLoginAttempt, reportLoginFailure } from "@/lib/auth/loginFeedback";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/schema/auth.schema";
import { useAsyncFieldRule, usePasswordValidation } from "@/lib/hooks/useFieldValidation";
import hybridResolver from "@/lib/validations/hybridResolver";
import type { AsyncMap, AuthAction } from "@/types/auth";

const getDefaults = (mode: "signin" | "signup"): LoginValues | RegisterValues => mode === "signin"
  ? { identifier: "", password: "" }
  : {
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };
export function useAuthForm(mode: AuthAction, forgotPasswordUrl: string) {
  const isLogin = mode === "signin";
  const resetAllValidations = useSetAtom(resetAllValidationsAtom);
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
  }, []);
  const { validate: emailValidate } = useAsyncFieldRule("email");
  const { validate: usernameValidate } = useAsyncFieldRule("username");
  const { validate: strengthRule } = usePasswordValidation("password");
  const asyncMap = useMemo(() => isLogin
    ? ({} as AsyncMap)
    : {
      email: emailValidate,
      username: usernameValidate,
      password: strengthRule,
    }, [isLogin, emailValidate, usernameValidate, strengthRule]);
  const schema = isLogin ? loginSchema : registerSchema;
  const resolver = useMemo(() => hybridResolver<LoginValues | RegisterValues>(schema, asyncMap), [schema, asyncMap]);
  const form = useForm<LoginValues | RegisterValues>({
    resolver,
    mode: "onChange",
    defaultValues: getDefaults(mode),
  });
  useEffect(() => {
    form.reset(getDefaults(mode));
    resetAllValidations();
  }, [mode, form, resetAllValidations]);
  const { mutate: login, isPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister<RegisterValues & {
    captchaToken?: string | null;
  }>();
  const { handleSubmit } = form;
  const onSubmit = async (values: LoginValues | RegisterValues) => {
    if(isLogin) {
      beginLoginAttempt();
      login({ ...values, captchaToken }, {
        onSuccess: (data) => {
          if(!data.success) {
            const error = data.error as RefineError;
            if(error?.name === "EMAIL_NOT_VERIFIED") {
              const identifier = (values as LoginValues).identifier;
              router.replace(`/activate?email=${encodeURIComponent(identifier)}`);
              return;
            }
          }
        },
        onError: () => reportLoginFailure(),
      });
    }
    else {
      register({ ...(values as RegisterValues), captchaToken }, {
        onSuccess: (data) => {
          if(!data.success) {
            console.error("Registration failed:", data.error);
            return;
          }
        },
      });
    }
  };
  const handleForgotPassword = useCallback(() => {
    window.location.href = forgotPasswordUrl;
  }, [forgotPasswordUrl]);
  const isSubmitting = isPending || isRegisterPending;
  const isReady = form.formState.isValid && !form.formState.isValidating && !isSubmitting;
  return { form, isLogin, isSubmitting, isReady, handleSubmit, onSubmit, handleForgotPassword, setCaptchaToken, handleCaptchaExpire };
}
