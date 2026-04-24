import { ValidatedButtonProps } from "@/interfaces/component-props.interface";
import { styled, useThemeProps } from "@mui/material/styles";
import { Login, PersonAdd } from "@mui/icons-material";
// import { Button, SaveButton } from "react-admin";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const PREFIX = "RazethValidatedButton";
const Root = styled(Button, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<ValidatedButtonProps>(({ theme }) => ({
  "&.MuiButton-root": {
    borderRadius: "50px",
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: theme.vars.palette.common.white,
  },

  // fontSize: "2.5rem",
  // ["& .MuiSvgIcon-root"]: {
  //   margin: props.theme.spacing(0.3),
  //   // fontSize: 18,
  // },
}));

const ValidatedButton = (inProps: ValidatedButtonProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  // const { errors, isValid, isDirty } = useFormState();
  // const hasErrors = Object.keys(errors).length > 0;
  // const hasErrors = Object.values(errors).some((error) => !!error);
  const {
    loading = false,
    authType = "signin",
    className,
    sx,
    ...rest
  } = props;
  const isSignIn = authType === "signin";
  return (
    <Root
      loading={loading}
      loadingPosition="start"
      startIcon={
        loading ? (
          <CircularProgress color="inherit" size={19} thickness={3} />
        ) : isSignIn ? (
          <Login />
        ) : (
          <PersonAdd />
        )
      }
      // label={isSignIn ? "Sign In" : "Sign Up"}
      type="submit"
      variant="contained"
      color="primary"
      size="large"
      // disabled={hasErrors || !isValid || !isDirty}
      fullWidth
      className={className}
      sx={sx}
      {...rest}
    >
      {isSignIn ? "Sign In" : "Sign Up"}
    </Root>
  );
};

export default ValidatedButton;
