// components/Auth/AuthForm.styles.tsx
import { styled } from "@mui/material/styles";
import { AuthFormProps } from "@/interfaces/component-props.interface";
import { Box } from "@mui/material";
import { fadeIn, fadeOut } from "@/theme/keyframes";

const PREFIX = "RazethAuthForm";

export const Root = styled("form", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthFormProps>(({ theme, mode }) => ({
  //   width: "100%",
  //   maxWidth: 420,
  //   margin: "0 auto",
  // animation: `${mode === "signin" ? fadeIn : fadeOut} 0.75s ease`,
  ["& .MuiCardContent-root"]: {
    minWidth: 300,
    padding: `${theme.spacing(0)}`,
  },
}));

export const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  //   gap: theme.spacing(2.5),
  //   padding: theme.spacing(4),
  //   backgroundColor: theme.palette.background.paper,
  //   borderRadius: theme.shape.borderRadius * 2,
  //   boxShadow: theme.shadows[8],
  gap: theme.spacing(0),
  input: {
    transition: theme.transitions.create("color", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short,
    }),
    "&:focus": {
      color: theme.palette.primary.main, // focused
    },
  },
  // Apply custom styles to the last child element inside this container
  "& > :last-child": {
    // For example, you could add extra margin to the button
    // if it's the last item. Let's override its default top margin.
    marginTop: theme.spacing(1),
  },
}));

export const PasswordArea = styled(Box, {
  name: PREFIX,
  slot: "PasswordArea",
  overridesResolver: (_props, styles) => styles.password,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // gap: theme.spacing(2),
}));

export const Footer = styled("div", {
  name: PREFIX,
  slot: "Footer",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  //   marginTop: theme.spacing(1),
  //   marginBottom: theme.spacing(2),
  fontWeight: 500,
  marginTop: "-0.5rem",
  marginBottom: "-0.5rem",
  width: "100%",
  gap: theme.spacing(0),
}));

// Optional: You can export more styled components if needed later
export const FormHeader = styled("div")(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
}));
