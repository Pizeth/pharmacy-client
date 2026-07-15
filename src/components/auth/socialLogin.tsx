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
import {
  AuthProvidersConfig,
  SocialLoginProps,
} from "@/interfaces/auth.interface";
import { useCallback, useEffect, useState } from "react";
// import { useNotify } from "ra-core";
import SocialButton from "../icons/components/socialButton";
import { getAuthProvidersConfig } from "@/lib/auth-config";
import { authClient } from "@/lib/auth-client";
import {
  PROVIDER_REGISTRY,
  RegisteredProviderId,
} from "@/lib/providers/socialProvider";

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
    // "& svg": {
    //   width: theme.spacing(2),
    //   height: theme.spacing(2),
    // },
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
  const [providers, setProviders] = useState<AuthProvidersConfig>({
    social: [],
    generic: [],
    base: [],
  });

  useEffect(() => {
    getAuthProvidersConfig().then(setProviders).catch(console.error);
  }, []);

  const handleProviderLogin = useCallback(async (provider: string) => {
    try {
      setLoading(provider);
      // Use authClient directly — it knows the correct baseURL + /api/auth path
      await authClient.signIn.social({
        /**
         * The social provider ID
         * @example "github", "google", "apple"
         */
        provider: provider as Parameters<
          typeof authClient.signIn.social
        >[0]["provider"],
        // 👈 where to redirect after OAuth
        /**
         * A URL to redirect after the user authenticates with the provider
         * @default "/"
         */
        // callbackURL: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/dashboard`,
        callbackURL: `${window.location.origin}/auth/callback`,
        /**
         * A URL to redirect if an error occurs during the sign in process
         */
        errorCallbackURL: `${window.location.origin}/auth/signup?error=provider_error&provider=${provider}`,
        /**
         * A URL to redirect if the user is newly registered
         */
        newUserCallbackURL: `${window.location.origin}/welcome`,
        /**
         * disable the automatic redirect to the provider.
         * @default false
         */
        // disableRedirect: true,
      });
      // setLoading(true);

      // const backendUrl =
      //   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      // const loginUrl = `${backendUrl}/auth/${provider}/login`;

      // // Redirect to OIDC provider
      // window.location.href = loginUrl;
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

  // Only render providers that are both active (from backend) AND have a registry entry
  const activeProviders = [...providers.social, ...providers.generic].filter(
    (key) => key in PROVIDER_REGISTRY,
  );

  // console.log("All providers:", providers);
  // console.log("Available providers:", PROVIDER_REGISTRY);
  // console.log("Active providers:", activeProviders);

  return (
    <Root container spacing={2} className={className} sx={sx} {...rest}>
      {activeProviders.map((key) => {
        const entry = PROVIDER_REGISTRY[key as RegisteredProviderId];
        const Icon = entry.icon;
        return (
          <SocialLogin.children key={key} size={{ xs: 12, sm: 4 }}>
            {children || (
              <SocialButton
                variant="outlined"
                icon={<Icon fontSize="medium" />}
                onClick={() => handleProviderLogin(key)}
                disabled={loading != null}
              >
                {loading === key ? (
                  <CircularProgress color="inherit" size="1rem" thickness={3} />
                ) : (
                  entry.name
                )}
              </SocialButton>
            )}
          </SocialLogin.children>
        );
      })}
    </Root>
  );
};

SocialLogin.children = SocialLoginContent;

export default SocialLogin;

// {
//   Object.entries(PROVIDERS).map(([key, provider]) => (
//     <SocialLogin.children key={key} size={{ xs: 12, sm: 4 }}>
//       {children || (
//         <SocialButton
//           variant="outlined"
//           icon={provider.icon}
//           onClick={() => handleProviderLogin(key)}
//           disabled={loading != null}
//         >
//           {isLoading(key) ? (
//             <CircularProgress color="inherit" size={"1rem"} thickness={3} />
//           ) : (
//             provider.name
//           )}
//         </SocialButton>
//       )}
//     </SocialLogin.children>
//   ));
// }

//   {Object.entries(PROVIDERS).map(([key, provider]) => (
//     <SocialLogin.children key={key} size={{ xs: 12, sm: 4 }}>
//       {children || (
//         <SocialButton
//           variant="outlined"
//           icon={provider.icon}
//           onClick={() => handleProviderLogin(key)}
//           disabled={loading != null}
//         >
//           {isLoading(key) ? (
//             <CircularProgress color="inherit" size={"1rem"} thickness={3} />
//           ) : (
//             provider.name
//           )}
//         </SocialButton>
//       )}
//     </SocialLogin.children>
//   ))}

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
