import { ValidatedButtonProps } from "@/interfaces/component-props.interface";
import { styled, useThemeProps } from "@mui/material/styles";
import { Login, PersonAdd } from "@mui/icons-material";
// import { Button, SaveButton } from "react-admin";
// import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const PREFIX = "RazethValidatedButton";
const Root = styled(Button, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<ValidatedButtonProps>(({ theme }) => ({
  "&.MuiButton-root": {
    color: theme.vars.palette.common.white,
    borderRadius: "50px",
    fontWeight: 700,
    fontSize: "0.9375rem",
    "&.Mui-disabled": { color: theme.vars.palette.action.disabled },
  },

  // fontSize: "2.5rem",
  // ["& .MuiSvgIcon-root"]: {
  //   margin: props.theme.spacing(0.3),
  //   // fontSize: 18,
  // },
}));

// ─── Component ───────────────────────────────────────────────────────────────

const ValidatedButton = (inProps: ValidatedButtonProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
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
      // MUI v7 native props — no LoadingButton import required
      loading={loading}
      loadingPosition="start"
      // Non-loading icon; LoadingButton replaces it with a spinner while loading
      // startIcon={
      //   loading ? (
      //     <CircularProgress color="inherit" size={19} thickness={3} />
      //   ) : isSignIn ? (
      //     <Login />
      //   ) : (
      //     <PersonAdd />
      //   )
      // }
      startIcon={isSignIn ? <Login /> : <PersonAdd />}
      type="submit"
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      disabled={loading} // keep button inert while submitting
      className={className}
      sx={sx}
      {...rest}
    >
      {isSignIn ? "Sign In" : "Sign Up"}
    </Root>
  );
};

export default ValidatedButton;
