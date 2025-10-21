import { Grid, Typography, useThemeProps } from "@mui/material";
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

const PREFIX = "RazethSocialLogin";

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

  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const handleProviderLogin = useCallback(
    async (provider: string) => {
      try {
        // setLoading(provider);

        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
        const loginUrl = `${backendUrl}/auth/${provider}/login`;

        // Redirect to OIDC provider
        window.location.href = loginUrl;
      } catch (err) {
        console.error("Login error:", err);
        notify("Failed to initiate login. Please try again.", {
          type: "error",
        });
        // Only reset loading if component is still mounted
        // if (isMounted.current) {
        //   setLoading(null);
        // }
      }
    },
    [notify]
  );

  return (
    <Grid container spacing={2}>
      {Object.entries(PROVIDERS).map(([key, provider]) => (
        <Grid key={key} size={{ xs: 6, sm: 4 }}>
          <SocialButton
            variant="outlined"
            onClick={() => handleProviderLogin(key)}
          >
            {provider.icon}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                display: { xs: "none", sm: "block" },
              }}
            >
              {provider.name}
            </Typography>
          </SocialButton>
        </Grid>
      ))}

      {/* <Grid size={{ xs: 6, sm: 4 }}>{google}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{apple}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{microsoft}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{meta}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{x}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{discord}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{linkedin}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{github}</Grid>

      <Grid size={{ xs: 6, sm: 4 }}>{gitlab}</Grid> */}
    </Grid>
  );
};

export default SocialLogin;
