// src/app/(protected)/verify-id/page.tsx — simplified sketch
"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifySchema, VerifyValues } from "@/schema/auth.schema";
import { FormProvider, useForm } from "react-hook-form";
import hybridResolver from "@/lib/validations/hybridResolver";
import { useAsyncFieldRule } from "@/lib/hooks/useFieldValidation";
import { AsyncMap } from "@/types/auth";
import { styled } from "@mui/material/styles";
import TextField from "@/components/inputs/textfield";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Button from "@mui/material/Button";
import { useCreate } from "@refinedev/core";
import Box from "@mui/material/Box";

const PREFIX = "RazethVerifyIdForm";

export const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column", // Stack the toolbar spacer and the form area vertically
  // height: "100dvh", // Fill the entire screen height
  // alignItems: "center",
  // justifyContent: "center",
  // ...theme.mixins.toolbar,
  // minHeight: "calc(100vh - 120px)", // Forces full screen space minus header
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden", // Prevents accidental sub-pixel scrolling
  // 1. Leverage the mixin as a pseudo-element before your content
  // "&::before": {
  //   content: '""',
  //   display: "block",
  //   ...theme.mixins.toolbar, // Dynamically matches the AppBar height responsively
  // },
  // Calculates height by subtracting BOTH dense toolbars (48px + 48px = 96px) from the viewport
  height: "calc(100dvh - 96px)",

  // Pushes the entire centered block down so it starts right below your stacked AppBar
  marginTop: "96px",

  // Adjust coordinates if MUI responsive dense layouts change on smaller breakpoints
  [theme.breakpoints.down("sm")]: {
    height: "calc(100dvh - 96px)",
    marginTop: "96px",
  },
}));

export const FormContainer = styled("form", {
  name: PREFIX,
  slot: "Form",
  overridesResolver: (_props, styles) => styles.form,
})(({ theme }) => ({
  //   width: "100%",
  //   maxWidth: 420,
  // animation: `${mode === "signin" ? fadeIn : fadeOut} 0.75s ease`,
  // ["& .MuiCardContent-root"]: {
  //   minWidth: 300,
  //   padding: `${theme.spacing(0)}`,
  // },
  display: "flex",
  flexDirection: "row", // Stack the input, error, and button vertically
  alignItems: "center", // Center items horizontally
  justifyContent: "center", // Center items vertically
  flexGrow: 1, // Fills all remaining space below the toolbar offset
  // minHeight: "calc(100vh - 120px)", // Fills the remaining screen space below your navigation bar
  width: "100%",
  maxWidth: 600, // Prevents the fullWidth input from stretching too wide
  margin: "0 auto", // Centers the entire form block container horizontally
  gap: theme.spacing(2), // Automatically creates clean spacing between elements
  padding: theme.spacing(3),
  // boxSizing: "border-box",
}));

export default function VerifyIdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [officialId, setOfficialId] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);

  const { validate: officialIdValidate } = useAsyncFieldRule("officialId");

  const asyncMap = useMemo(
    () => ({ officialId: officialIdValidate }) as AsyncMap,
    [officialIdValidate],
  );

  const schema = verifySchema;

  const form = useForm({
    resolver: hybridResolver(schema, asyncMap),
    mode: "onChange",
    defaultValues: {
      officialId: "",
    },
  });

  // Intercept typing updates and instantly wipe out any letters
  const currentId = form.watch("officialId");
  useMemo(() => {
    if (currentId && /[^0-9]/.test(currentId)) {
      form.setValue("officialId", currentId.replace(/[^0-9]/g, ""), {
        shouldValidate: true,
      });
    }
  }, [currentId, form]);

  const {
    mutate: create,
    mutation: { isPending },
  } = useCreate();
  // const isSubmitting = isPending || isRegisterPending;
  const isReady =
    form.formState.isValid && !form.formState.isValidating && !isPending;

  const { handleSubmit } = form;

  const onSubmit = async (values: VerifyValues) => {
    // e.preventDefault();
    // setLoading(true);
    // setError(null);

    create(
      {
        resource: "account/link-employee", // Target backend API resource route
        values: values,
      },
      {
        onSuccess: (data) => {
          // if (!data.success) {
          //   // handle error
          //   console.error("Registration failed:", data.error);
          //   return;
          // }

          const callbackUrl = searchParams.get("callbackUrl");
          router.replace(
            callbackUrl ? decodeURIComponent(callbackUrl) : "/fts",
          );
        },
        onError: (err: any) => {
          // setError(err?.message ?? "Verification failed");
        },
      },
    );

    // try {
    //   await axiosInstance.post(`${API_URL}/account/link-employee`, {
    //     values,
    //   });
    //   const callbackUrl = searchParams.get("callbackUrl");
    //   router.replace(callbackUrl ? decodeURIComponent(callbackUrl) : "/fts");
    //   // router.replace("/fts");
    // } catch (err: any) {
    //   setError(err.response?.data?.message ?? "Verification failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Root>
      <FormProvider {...form}>
        <FormContainer
          onSubmit={handleSubmit(onSubmit)}
          // className={className}
          // sx={sx}
          // {...rest}
        >
          <TextField
            name="officialId"
            label="អត្តលេខមន្រ្តីរាជការ"
            required
            iconStart={<AccountBoxIcon />}
            fullWidth
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }} // Brings up the numeric keypad on mobile devices
            onKeyDown={(e) => {
              if (!/[0-9]|Backspace|Delete|Arrow/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {/* <input
          value={officialId}
          onChange={(e) => setOfficialId(e.target.value)}
          placeholder="Enter your 10-digit Employee ID"
          maxLength={10}
        /> */}
          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
          {/* <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button> */}
          <Button
            loading={isPending}
            disabled={!isReady}
            type="submit" // Crucial fix: explicitly enables form submission
            variant="contained" // Gives the button background color
          >
            {isPending ? "កំពុងផ្ទៀងផ្ទាត់..." : "ផ្ទៀងផ្ទាត់"}
          </Button>
        </FormContainer>
      </FormProvider>
    </Root>
  );
}
