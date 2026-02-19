import {
  CircularProgress,
  Grid,
  styled,
  Theme,
  useThemeProps,
} from "@mui/material";
import {
  Apple,
  Discord,
  Github,
  Gitlab,
  Google,
  Linkedin,
  Meta,
  Microsoft,
  X,
} from "../icons/socialIcons";
import { SocialLoginProps } from "@/interfaces/auth.interface";
import { useCallback, useState } from "react";
import { useNotify } from "ra-core";
import SocialButton from "./ui/socialButton";
// import { useSearchParams } from "next/navigation";
import { useSearchParams } from "react-router-dom";

const PREFIX = "RazethSocialLogin";

const SocialLoginRoot = styled(Grid, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SocialLoginProps>(() => ({}));

const SocialLoginContent = styled(Grid, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})((props: { theme: Theme }) => ({
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: props.theme.spacing(1),
    width: "100%",
    padding: props.theme.spacing(1),
    textTransform: "none",
    border: `1px solid ${props.theme.palette.divider}`,
    transition: props.theme.transitions.create(
      ["transform", "background-color"],
      {
        duration: props.theme.transitions.duration.standard,
        easing: props.theme.transitions.easing.easeInOut,
      },
    ),
    "&:hover": {
      border: `1px solid ${props.theme.palette.divider}`,
      backgroundColor: props.theme.palette.action.hover,
      transform: "scale(1.05)", // enlarge smoothly
      boxShadow: props.theme.shadows[3],
    },
    "& svg": {
      width: props.theme.spacing(2),
      height: props.theme.spacing(2),
    },
  },
}));

// Provider configuration
const PROVIDERS = {
  google: {
    name: "Google",
    icon: <Google />,
  },
  apple: {
    name: "Apple",
    icon: <Apple />,
  },
  microsoft: {
    name: "Microsoft",
    icon: <Microsoft />,
  },
  meta: {
    name: "Meta",
    icon: <Meta />,
  },
  x: {
    name: "X",
    icon: <X />,
  },
  linkedin: {
    name: "Linkedin",
    icon: <Linkedin />,
  },
  discord: {
    name: "Discord",
    icon: <Discord />,
  },
  github: {
    name: "GitHub",
    icon: <Github />,
  },
  gitlab: {
    name: "GitLab",
    icon: <Gitlab />,
  },
};

const SocialLogin = (inProps: SocialLoginProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const notify = useNotify();
  const [searchParams] = useSearchParams();

  // State management with standard useState
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleProviderLogin = useCallback(
    async (provider: string) => {
      try {
        setLoading(provider);
        // setLoading(true);

        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
        const loginUrl = `${backendUrl}/auth/${provider}/login`;

        // Redirect to OIDC provider
        window.location.href = loginUrl;
      } catch (err) {
        console.error("Login error:", err);
        notify("razeth.auth.oidc_error", {
          type: "error",
        });
        // Only reset loading if component is still mounted
        // if (isMounted.current) {
        //   setLoading(null);
        // }
      }
    },
    [notify],
  );

  const isLoading = useCallback((type: string) => loading === type, [loading]);

  return (
    <SocialLoginRoot container spacing={2}>
      {Object.entries(PROVIDERS).map(([key, provider]) => (
        <SocialLogin.children key={key} size={{ xs: 6, sm: 4 }}>
          <SocialButton
            variant="outlined"
            icon={provider.icon}
            onClick={() => handleProviderLogin(key)}
            disabled={loading != null}
          >
            {isLoading(key) ? (
              <CircularProgress color="inherit" size={"1rem"} thickness={3} />
            ) : (
              provider.name
            )}
          </SocialButton>
        </SocialLogin.children>
      ))}
    </SocialLoginRoot>
  );
};

SocialLogin.children = SocialLoginContent;

export default SocialLogin;

// return (
//   <Grid container spacing={2}>
//     {Object.entries(PROVIDERS).map(([key, provider]) => (
//       <Grid key={key} size={{ xs: 6, sm: 4 }}>
//         <SocialButton
//           variant="outlined"
//           onClick={() => handleProviderLogin(key)}
//         >
//           {provider.icon}
//           <Typography variant="body2">{provider.name}</Typography>
//         </SocialButton>
//       </Grid>
//     ))}

//     {/* <Grid size={{ xs: 6, sm: 4 }}>{google}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{apple}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{microsoft}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{meta}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{x}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{discord}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{linkedin}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{github}</Grid>

//     <Grid size={{ xs: 6, sm: 4 }}>{gitlab}</Grid> */}
//   </Grid>
// );
