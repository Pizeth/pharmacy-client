import React, { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Configuration ---
const PRIMARY_GRADIENT =
  "linear-gradient(rgb(255, 151, 207), rgb(255, 68, 146))";
const ANIMATION_SPEED = "0.6s";

// Custom Styled Button
const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "20px",
  padding: "12px 45px",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
  textTransform: "uppercase",
  transition: "transform 80ms ease-in",
  "&:active": { transform: "scale(0.95)" },
  ...(variant === "contained" && {
    background: PRIMARY_GRADIENT,
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }),
  ...(variant === "outlined" && {
    background: "transparent",
    color: "white",
    border: "1px solid white",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid white",
    },
  }),
}));

const CustomLoginPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // React-Admin hooks
  const login = useLogin();
  const notify = useNotify();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username: email, password }).catch(() =>
      notify("Invalid email or password")
    );
  };

  const handleToggle = () => setIsSignUpMode(!isSignUpMode);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f6f5f7",
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          "@import":
            'url("https://fonts.googleapis.com/css?family=Montserrat:400,800")',
        }}
      />

      <Paper
        elevation={10}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 14px 28px rgba(0,0,0,0.25)",
          position: "relative",
          overflow: "hidden",
          width: "768px",
          maxWidth: "100%",
          minHeight: "480px",
          display: "flex", // Split layout: Left | Right
        }}
      >
        {/* --- LEFT SIDE: Static Container, Changing Text --- */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            background: PRIMARY_GRADIENT,
            position: "relative", // Relative for absolute children
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {/* Content A: Visible when in "Sign In" mode (Asking user to Sign Up) */}
          <Box
            sx={{
              position: "absolute",
              textAlign: "center",
              padding: "0 40px",
              opacity: isSignUpMode ? 0 : 1, // Fade Logic
              transform: isSignUpMode ? "translateY(20px)" : "translateY(0)", // Subtle movement
              pointerEvents: isSignUpMode ? "none" : "auto",
              transition: `all ${ANIMATION_SPEED} ease-in-out`,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Hello, Friend!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Enter your personal details and start your journey with us
            </Typography>
            <StyledButton variant="outlined" onClick={handleToggle}>
              Sign Up
            </StyledButton>
          </Box>

          {/* Content B: Visible when in "Sign Up" mode (Asking user to Sign In) */}
          <Box
            sx={{
              position: "absolute",
              textAlign: "center",
              padding: "0 40px",
              opacity: isSignUpMode ? 1 : 0, // Fade Logic
              transform: isSignUpMode ? "translateY(0)" : "translateY(20px)",
              pointerEvents: isSignUpMode ? "auto" : "none",
              transition: `all ${ANIMATION_SPEED} ease-in-out`,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              To keep connected with us please login with your personal info
            </Typography>
            <StyledButton variant="outlined" onClick={handleToggle}>
              Sign In
            </StyledButton>
          </Box>
        </Box>

        {/* --- RIGHT SIDE: Sliding Forms --- */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            position: "relative",
            overflow: "hidden", // Mask the sliding forms
          }}
        >
          {/* Sign In Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              position: "absolute",
              top: isSignUpMode ? "-100%" : "0", // Slide Up/Down
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 50px",
              textAlign: "center",
              transition: `top ${ANIMATION_SPEED} ease-in-out`,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 2, color: "#000" }}
            >
              Sign in
            </Typography>
            <TextField
              fullWidth
              variant="filled"
              label="Email"
              margin="dense"
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: "#eee", borderRadius: 1 },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Password"
              type="password"
              margin="dense"
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: "#eee", borderRadius: 1 },
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography
              variant="body2"
              sx={{ my: 2, cursor: "pointer", color: "#333" }}
            >
              Forgot your password?
            </Typography>
            <StyledButton variant="contained" type="submit">
              Sign In
            </StyledButton>
          </Box>

          {/* Sign Up Form */}
          <Box
            component="form"
            sx={{
              position: "absolute",
              top: isSignUpMode ? "0" : "100%", // Slide Up/Down
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 50px",
              textAlign: "center",
              transition: `top ${ANIMATION_SPEED} ease-in-out`,
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 2, color: "#000" }}
            >
              Create Account
            </Typography>
            <TextField
              fullWidth
              variant="filled"
              label="Name"
              margin="dense"
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: "#eee", borderRadius: 1 },
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Email"
              margin="dense"
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: "#eee", borderRadius: 1 },
              }}
            />
            <TextField
              fullWidth
              variant="filled"
              label="Password"
              type="password"
              margin="dense"
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: "#eee", borderRadius: 1 },
              }}
            />
            <Box sx={{ mt: 2 }}>
              <StyledButton variant="contained">Sign Up</StyledButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomLoginPage;
