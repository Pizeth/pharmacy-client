import {
  SignUpFormProps,
  ValidatedButtonProps,
} from "@/interfaces/component-props.interface";
import Box from "@mui/material/Box";
import { styled, useThemeProps } from "@mui/material/styles";
import { Login, PersonAdd } from "@mui/icons-material";
import { Button, SaveButton } from "react-admin";
import { useFormState } from "react-hook-form";
import Loader from "./loading";
import CircularProgress from "@mui/material/CircularProgress";

const PREFIX = "RazethValidatedButton";
const VaidatedSaveButton = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SignUpFormProps>(() => ({
  button: {
    // borderRadius: "2.5rem",
    fontWeight: 700,
    fontSize: "0.9375rem",
    // fontSize: "2.5rem",
    // ["& .MuiSvgIcon-root"]: {
    //   margin: props.theme.spacing(0.3),
    //   // fontSize: 18,
    // },
  },
}));
const ValidatedButton = (inProps: ValidatedButtonProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { errors, isValid, isDirty } = useFormState();
  // const hasErrors = Object.keys(errors).length > 0;
  const hasErrors = Object.values(errors).some((error) => !!error);
  const { loading, authType = "login", className, sx, ...rest } = props;
  return (
    <VaidatedSaveButton>
      {/* Conditional rendering */}
      {authType === "signin" ? (
        <Button
          loading={loading}
          loadingPosition="start"
          startIcon={<Login />}
          // startIcon={
          //   loading ? (
          //     <Loader />
          //   ) : (
          //     // <CircularProgress color="inherit" size={19} thickness={3} />
          //     <Login />
          //   )
          // }
          label="razeth.auth.sign_in"
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={hasErrors || !isValid || !isDirty}
          fullWidth
          className={className}
          sx={sx}
          {...rest}
        />
      ) : (
        <SaveButton
          icon={
            loading ? (
              <Loader />
            ) : (
              // <CircularProgress color="inherit" size={19} thickness={3} />
              <PersonAdd />
            )
          }
          label="razeth.auth.sign_up"
          // type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={hasErrors || !isValid || !isDirty}
          fullWidth
          className={className}
          sx={sx}
          {...rest}
        />
      )}
    </VaidatedSaveButton>
  );
};

export default ValidatedButton;
