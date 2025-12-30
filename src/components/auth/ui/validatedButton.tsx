import {
  SignUpFormProps,
  ValidatedButtonProps,
} from "@/interfaces/component-props.interface";
import Box from "@mui/material/Box";
import { styled, useThemeProps } from "@mui/material/styles";
import { Login, PersonAdd } from "@mui/icons-material";
import { SaveButton } from "react-admin";
import { useFormState } from "react-hook-form";
import Loader from "./loading";
import CircularProgress from "@mui/material/CircularProgress";

const PREFIX = "RazethValidatedButton";
const VaidatedSaveButton = styled(Box, {
  name: PREFIX,
  slot: "Button",
  overridesResolver: (_props, styles) => styles.button,
})<SignUpFormProps>(() => ({}));
const ValidatedButton = (inProps: ValidatedButtonProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { errors, isValid, isDirty } = useFormState();
  // const hasErrors = Object.keys(errors).length > 0;
  const hasErrors = Object.values(errors).some((error) => !!error);
  const { loading, authType = "login", className, sx, ...rest } = props;
  return (
    <VaidatedSaveButton>
      <SaveButton
        icon={
          loading ? (
            <Loader />
          ) : // <CircularProgress color="inherit" size={19} thickness={3} />
          authType === "login" ? (
            <Login />
          ) : (
            <PersonAdd />
          )
        }
        label={
          authType === "login" ? "razeth.auth.login" : "razeth.auth.sign_up"
        }
        variant="contained"
        color="primary"
        size="large"
        // disabled={loading}
        disabled={hasErrors || !isValid || !isDirty}
        fullWidth
        className={className}
        sx={sx}
        {...rest}
      />
    </VaidatedSaveButton>
  );
};

export default ValidatedButton;
