import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, useTheme } from "@mui/material/styles";
import { makePulseKeyframes } from "@/utils/themeUtils"; // Assuming these exist in your utilities
// import { borderAnimation, hi, hii, shimmer } from "../keyframes";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { borderAnimation, hi, hii, shimmer } from "@/theme/keyframes";

// 1. Replicate the DrawerNavToggle styling logic
const PREFIX = "RazethLoader";

const LOADING_MESSAGES = [
  "Initializing System",
  "Syncing Neural Interface",
  "Loading Assets",
  "Calibrating Interface",
  "Fetching Data Streams",
  "Optimizing Core",
  "Establishing Connection",
];

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
})(({ theme }) => ({
  position: "relative",
  width: `max(100px, 20vmin)`, // Larger size for the main loader
  height: `max(100px, 20vmin)`,
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: `0 0 30px 15px ${theme.palette.primary.main}50`, // Stronger glow

  // Custom border effect from DrawerNavToggle
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-2px clamp(15px, 3vmin, 4vmin)",
    background: `linear-gradient(315deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
    animation: `${borderAnimation} 3s linear infinite`, // Uses the same animation
    zIndex: 1,
  },

  // Inner background from DrawerNavToggle
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "3px",
    background: theme.palette.background.paper,
    borderRadius: "50%",
    zIndex: 2,
  },
}));

const ContentWrapper = styled(Box, {
  name: PREFIX,
  slot: "Content",
})(({ theme }) => ({
  position: "relative",
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  overflow: "hidden",
  border: "4px solid #070a1c", // Matching border

  // Reuse the background and point grid animations from DrawerNavToggle
  backgroundColor: "#000",
  backgroundImage: theme.custom.sideImage.animationBackground.backgroundImage,
  backgroundSize: theme.custom.sideImage.animationBackground.backgroundSize,
  animation: `${hi} 150s linear infinite`,

  "&::after": {
    content: '""',
    borderRadius: "50%",
    position: "absolute",
    inset: 0,
    zIndex: 1,
    backgroundImage: `radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 2px,
      hsl(0 0 4%) 2px
    )`,
    backgroundSize: "8px 8px",
    animation: `${hii} 10s linear infinite`,
  },
}));

const PulseRing = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  border: `3px solid ${theme.palette.error.main}`,
  opacity: 0,
  zIndex: 4,
  //   animation: `${makePulseKeyframes([
  //     { offset: 0, opacity: 0.6, scale: 1 },
  //     { offset: 1, opacity: 0, scale: 1.6 },
  //   ])} 2s infinite`, // Custom pulse timing
  animation: `${makePulseKeyframes(
    theme.custom.sideImage.circlePulseSequence,
  )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  color: theme.palette.error.main,
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.4rem", // Extra wide for that "premium" feel
  textAlign: "center",
  zIndex: 10,
  animation: `${shimmer} 2s ease-in-out infinite`,
  textShadow: `0 0 10px ${theme.palette.error.main}50`,
}));

// 2. Combine with CircularProgress for the loading indication
const PulseLoader = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  // useMemo ensures we only pick a random message once per mount
  const displayMessage = useMemo(() => {
    return LOADING_MESSAGES[
      Math.floor(Math.random() * LOADING_MESSAGES.length)
    ];
  }, []);

  // Lock body scroll when loader is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //   return (
  //     <Fade in={open} timeout={800} unmountOnExit>
  //       <Box
  //         sx={{
  //           position: "fixed",
  //           top: 0,
  //           left: 0,
  //           width: "100vw",
  //           height: "100vh",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           zIndex: theme.zIndex.modal + 1, // Ensure it's on top
  //           backgroundColor: "rgba(0,0,0,0.8)", // Dark background for focus
  //           backdropFilter: "blur(5px)", // Subtle blur effect
  //         }}
  //       >
  //         <Root>
  //           <ContentWrapper>
  //             <CircularProgress
  //               size="70%" // Occupy most of the inner space
  //               thickness={2} // Thinner line for an elegant feel
  //               color="error" // Set color from theme
  //               sx={{
  //                 position: "relative",
  //                 zIndex: 5,
  //                 animationDuration: "1s", // Custom speed
  //               }}
  //             />
  //           </ContentWrapper>
  //           <PulseRing />
  //         </Root>
  //       </Box>
  //     </Fade>
  //   );

  return (
    <Fade in={open} timeout={800}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column", // Stack spinner and text
          justifyContent: "center",
          alignItems: "center",
          zIndex: theme.zIndex.modal + 1,
          backgroundColor: "rgba(0,0,0,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Root>
            <ContentWrapper>
              <CircularProgress
                size="70%" // Occupy most of the inner space
                thickness={2} // Thinner line for an elegant feel
                color="error" // Set color from theme
                sx={{
                  position: "relative",
                  zIndex: 5,
                  animationDuration: "1s", // Custom speed
                }}
              />
            </ContentWrapper>
            <PulseRing />
          </Root>
        </Box>
        <LoadingText variant="caption">{displayMessage}</LoadingText>
      </Box>
    </Fade>
  );
};

export default PulseLoader;
