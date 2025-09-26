// components/auth/ReactAdminLoginPage.tsx - React Admin Login Component
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  Stack,
  Chip,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import { useLogin, useNotify } from "react-admin"; // Removed useSafeSetState
import { useSearchParams } from "react-router-dom";

// Custom Discord icon component
const DiscordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Styled components for provider buttons
const StyledProviderButton = styled(Button)<{ provider: string }>(
  ({ theme, provider }) => {
    const configs = {
      google: {
        backgroundColor: "#fff",
        borderColor: theme.palette.grey[300],
        color: theme.palette.text.primary,
        "&:hover": {
          backgroundColor: theme.palette.grey[50],
        },
      },
      facebook: {
        backgroundColor: "#1877F2",
        borderColor: "#1877F2",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#166FE5",
        },
      },
      discord: {
        backgroundColor: "#5865F2",
        borderColor: "#5865F2",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#4752C4",
        },
      },
    };

    return configs[provider as keyof typeof configs] || {};
  }
);

// Provider configuration
const PROVIDERS = {
  google: {
    name: "Google",
    icon: <Google />,
  },
  facebook: {
    name: "Facebook",
    icon: <Facebook />,
  },
  discord: {
    name: "Discord",
    icon: <DiscordIcon />,
  },
};

interface LoginFormData {
  email: string;
  password: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReactAdminLoginPage = () => {
  const theme = useTheme();
  const login = useLogin();
  const notify = useNotify();
  const [searchParams] = useSearchParams();

  // Track component mount state
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // State management with standard useState
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});

  // Check for OAuth callback results
  useEffect(() => {
    const error = searchParams.get("error");
    const authSuccess = searchParams.get("auth");
    const logout = searchParams.get("logout");

    if (error) {
      notify(`Authentication failed: ${decodeURIComponent(error)}`, {
        type: "error",
      });
    } else if (authSuccess === "success") {
      notify("Authentication successful!", { type: "success" });
      // Let React Admin handle the redirect
    } else if (logout === "success") {
      notify("Logged out successfully", { type: "success" });
    }
  }, [searchParams, notify]);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      try {
        setLoading("form");

        // Use React Admin's login function
        await login({
          email: formData.email,
          password: formData.password,
        });

        notify("Login successful!", { type: "success" });
      } catch (error: unknown) {
        console.error("Login error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Login failed. Please check your credentials.";
        notify(errorMessage, {
          type: "error",
        });
      } finally {
        // Only update state if component is still mounted
        if (isMounted.current) {
          setLoading(null);
        }
      }
    },
    [formData, validateForm, login, notify]
  );

  const handleProviderLogin = useCallback(
    async (provider: string) => {
      try {
        setLoading(provider);

        const backendUrl =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
        const loginUrl = `${backendUrl}/auth/${provider}/login`;

        // Redirect to OIDC provider
        window.location.href = loginUrl;
      } catch (err) {
        console.error("Login error:", err);
        notify("Failed to initiate login. Please try again.", {
          type: "error",
        });
        // Only reset loading if component is still mounted
        if (isMounted.current) {
          setLoading(null);
        }
      }
    },
    [notify]
  );

  const isLoading = useCallback((type: string) => loading === type, [loading]);

  const handleForgotPassword = useCallback(() => {
    // Navigate to forgot password page
    window.location.href = "/auth/forgot-password";
  }, []);

  const handleCreateAccount = useCallback(() => {
    // Navigate to registration page
    window.location.href = "/auth/register";
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}20)`,
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          boxShadow: theme.shadows[8],
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          {/* Login Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab label="Email & Password" />
              <Tab label="Social Login" />
            </Tabs>
          </Box>

          {/* Form Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box
              component="form"
              onSubmit={handleFormSubmit}
              sx={{ width: "100%" }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={loading !== null}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={loading !== null}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <MuiLink
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading !== null}
                  sx={{ height: 48 }}
                >
                  {isLoading("form") ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Stack>
            </Box>
          </TabPanel>

          {/* Social Login Tab */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={2}>
              {Object.entries(PROVIDERS).map(([key, provider]) => (
                <StyledProviderButton
                  key={key}
                  provider={key}
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => handleProviderLogin(key)}
                  disabled={loading !== null}
                  sx={{ height: 48 }}
                >
                  {isLoading(key) ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Connecting to {provider.name}...
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {provider.icon}
                      Continue with {provider.name}
                    </Box>
                  )}
                </StyledProviderButton>
              ))}
            </Stack>
          </TabPanel>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Chip label="New to our platform?" size="small" />
          </Divider>

          {/* Sign up link */}
          <Box sx={{ textAlign: "center" }}>
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              onClick={handleCreateAccount}
            >
              Create an account
            </MuiLink>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 3 }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </CardContent>
      </Card>

      {/* Support Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Need help? Contact our support team
        </Typography>
      </Box>
    </Box>
  );
};

export default ReactAdminLoginPage;
