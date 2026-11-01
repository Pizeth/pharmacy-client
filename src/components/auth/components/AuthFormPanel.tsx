"use client";

import type { ReactNode } from "react";
import { Box, CardContent, Grid } from "@mui/material";
import type { AuthAction } from "@/types/auth";
import ThemeToggle from "@/components/effect/themes/themeToggle";
import ParticleHexBackground from "@/components/effect/backgrounds/particleHex";
import AuthForm from "../ui/authForm";
import AuthNavigationLink from "../ui/authNavaigation";
import { AuthErrorNotice } from "../AuthErrorNotice";
import { FormTransition, ThemeToggleWrapper } from "../styles/auth.styles";

interface AuthFormPanelProps {
  mode: AuthAction;
  onToggle: () => void;
  enableToggle: boolean;
  avatar: ReactNode;
  navigation?: ReactNode;
  divider: ReactNode;
  social: ReactNode;
  children?: ReactNode;
}
export function AuthFormPanel({
  mode, onToggle, enableToggle, avatar, navigation, divider, social, children,
}: AuthFormPanelProps) {
  const recoveryUrl = process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL?.trim();
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <ParticleHexBackground
        size={7} stroke={0.5} gap={0} speed={64} glowRadius={25}
        gridStrokeColor="rgba(255, 255, 255, 0.0125)"
      >
        <CardContent>
          <ThemeToggleWrapper><ThemeToggle /></ThemeToggleWrapper>
          <Box>
            {avatar}
            <FormTransition key={mode} mode={mode}>
              {children ?? <AuthForm mode={mode}
                forgotPasswordUrl={recoveryUrl || "/hrd/contact"}
                forgotPassword={recoveryUrl ? "Forgot your password?" : "Need sign-in help?"}
              />}
            </FormTransition>
            {enableToggle && (navigation ?? <AuthNavigationLink mode={mode} onToggle={onToggle} />)}
            {divider}
            {social}
            {mode === "signin" && <AuthErrorNotice />}
          </Box>
        </CardContent>
      </ParticleHexBackground>
    </Grid>
  );
}
