import { CircularProgress, Grid, styled, useThemeProps } from "@mui/material";
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
// import { useNotify } from "ra-core";
import SocialButton from "../icons/components/socialButton";

const PREFIX = "RazethSocialLogin";

const Root = styled(Grid, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<SocialLoginProps>(() => ({
  // border: "0.5px solid red",
}));

const SocialLoginContent = styled(Grid, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    width: "100%",
    padding: theme.spacing(1),
    textTransform: "none",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.vars.palette.customShadows.neumorphic,
    transition: theme.transitions.create(["transform", "background-color"], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
    "&:hover": {
      border: `1px solid ${theme.vars.palette.divider}`,
      backgroundColor: theme.palette.action.hover,
      transform: "scale(1.05)", // enlarge smoothly
      boxShadow: theme.shadows[3],
    },
    "& svg": {
      width: theme.spacing(2),
      height: theme.spacing(2),
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
  // microsoft: {
  //   name: "Microsoft",
  //   icon: <Microsoft />,
  // },
  meta: {
    name: "Meta",
    icon: <Meta />,
  },
  // x: {
  //   name: "X",
  //   icon: <X />,
  // },
  // linkedin: {
  //   name: "Linkedin",
  //   icon: <Linkedin />,
  // },
  // discord: {
  //   name: "Discord",
  //   icon: <Discord />,
  // },
  // github: {
  //   name: "GitHub",
  //   icon: <Github />,
  // },
  // gitlab: {
  //   name: "GitLab",
  //   icon: <Gitlab />,
  // },
};

const SocialLogin = (inProps: SocialLoginProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const { children, className, sx, ...rest } = props;

  // const notify = useNotify();

  // State management with standard useState
  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleProviderLogin = useCallback(async (provider: string) => {
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
      // notify("razeth.auth.oidc_error", {
      //   type: "error",
      // });
      // Only reset loading if component is still mounted
      // if (isMounted.current) {
      //   setLoading(null);
      // }
    }
  }, []);

  const isLoading = useCallback((type: string) => loading === type, [loading]);

  return (
    <Root container spacing={2} className={className} sx={sx} {...rest}>
      {Object.entries(PROVIDERS).map(([key, provider]) => (
        <SocialLogin.children key={key} size={{ xs: 6, sm: 4 }}>
          {children || (
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
          )}
        </SocialLogin.children>
      ))}
    </Root>
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
