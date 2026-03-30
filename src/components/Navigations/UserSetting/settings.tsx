"use client";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  MenuItem,
  ListItemIcon,
  Chip,
  Paper,
  Popover,
  alpha,
  useTheme,
  LinearProgress,
  CircularProgressProps,
  CircularProgress,
} from "@mui/material";
import {
  SettingsOutlined,
  ContactSupportOutlined,
  GitHub,
  PaletteOutlined,
  LogoutOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import BounceTransition from "@/theme/effects/animation";
import { color, motion } from "framer-motion";
import { Theme, useThemeProps } from "@mui/material/styles";
import { useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { UserMenuProps } from "@/interfaces/component-props.interface";
import ParticleContainer from "@/theme/effects/particle";
import options from "@/configs/particleConfig";

// interface UserMenuProps {
//   anchorEl: HTMLElement | null;
//   open: boolean;
//   onClose: () => void;
//   user: {
//     name: string;
//     email: string;
//     role: string;
//     storageUsed: number;
//     storageTotal: number;
//   };
// }

const PREFIX = "RazethUserSetting";

// 1. Particle Configuration (Subtle & Slow)
const particleOptions = (theme: Theme) => ({
  style: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
    },
    modes: {
      grab: {
        distance: 125,
        links: { opacity: 0.5, color: theme.palette.primary.main },
      },
      repulse: {
        distance: 50,
        duration: 0.75,
      },
    },
  },
  particles: {
    color: { value: theme.palette.primary.main },
    links: {
      color: theme.palette.primary.main,
      distance: 125,
      enable: true,
      opacity: 0.25,
      width: 1,
    },
    move: { enable: true, speed: 1, direction: "none", outModes: "out" },
    number: {
      value: 25,
      // density: { enable: true, area: 800 }
    },
    opacity: { value: 0.5 },
    shape: { type: "star" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
});

// 1. Define the Animation Variants
const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.075, // Delay between each item
      delayChildren: 0.125, // Wait for the main menu bounce to finish
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1, // Items exit in reverse order
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  closed: {
    opacity: 0,
    x: -15, // Items start slightly to the left
  },
};

export const UserMenu = (inProps: UserMenuProps) => {
  const theme = useTheme();

  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { anchorEl, open, onClose, data } = props;

  // Initialize particles once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  const storagePercent = (data.storageUsed / data.storageTotal) * 100;

  // 1. Sound Logic
  // Tip: Use a very short 'pop' or 'click' sound (under 200ms)
  const playOpenSound = () => {
    const audio = new Audio("/static/audios/click_004.ogg");
    audio.volume = 0.2; // Keep it subtle!
    audio.play().catch(() => {}); // Catch prevents errors if browser blocks autoplay
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      onTransitionEnter={playOpenSound} // Trigger sound on open
      // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      // transformOrigin={{ vertical: "top", horizontal: "right" }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      // anchorOrigin={{
      //   vertical: "top",
      //   horizontal: "left",
      // }}
      // transformOrigin={{
      //   vertical: "bottom",
      //   horizontal: "left",
      // }}
      // TransitionComponent={BounceTransition}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            mt: 1.5,
            width: "clamp(150px, 80%, 250px)",
            borderRadius: "15px",
            // overflow: "hidden",
            // boxShadow: `0px 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            // Ensure background is transparent so the motion.div
            // handles the shadow and shape correctly
            overflow: "visible",
            background: "transparent", // Let the Paper inside handle styles
            boxShadow: "none",
            border: "none",
            // border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            // backgroundImage: "none", // Removes default MUI overlay in dark mode
          },
        },
        // 2. Attach the Bouncy Transition
        // transition: BounceTransition,
      }}
      // slots={{
      //   transition: BounceTransition,
      // }}
      //   PaperProps={{
      //     sx: {
      //       mt: 1.5,
      //       width: 280,
      //       borderRadius: "20px",
      //       overflow: "hidden",
      //       boxShadow: `0px 10px 40px ${alpha(theme.palette.common.black, 0.1)}`,
      //       border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      //       backgroundImage: "none", // Removes default MUI overlay in dark mode
      //     },
      //   }}
    >
      {/* 3. Wrap content in a Paper inside the motion div */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: "25px",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: "relative",
          // 2. Glassmorphism Secret Sauce
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px) saturate(180%)",
          // border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
        }}
      >
        {/* 3. Particle Background Layer */}
        <ParticleContainer id="menu-particles" options={options({})} />
        {/* 4. Content Layer (zIndex ensures text is above particles) */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* 1. Profile Header */}
          <Box sx={{ p: 2.5, pb: 2 }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ lineHeight: 1.2 }}
            >
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {data.email}
            </Typography>

            {/* Storage Bar (Ref Image 1) */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgressStatic value={storagePercent} />
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={700} display="block">
                  {data.storageUsed} used of {data.storageTotal}GB
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  fontWeight={700}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Try pro plan
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider
            sx={{
              borderStyle: "dashed",
              borderColor: alpha(theme.palette.divider, 0.1),
            }}
          />

          {/* 2. Wrap the List in a motion.div with container variants */}
          <motion.div
            initial="closed"
            animate={open ? "open" : "closed"}
            variants={containerVariants}
            style={{ padding: "8px" }}
          >
            {/* 3. Wrap each MenuItem in a motion.div with item variants */}
            {[
              {
                label: "Settings",
                icon: <SettingsOutlined fontSize="small" />,
              },
              {
                label: "Support",
                icon: <ContactSupportOutlined fontSize="small" />,
              },
              { label: "Github", icon: <GitHub fontSize="small" /> },
            ].map((item) => (
              <motion.div key={item.label} variants={itemVariants}>
                <MenuItem onClick={onClose} sx={menuItemStyle(theme)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <Typography variant="body2" fontWeight={500}>
                    {item.label}
                  </Typography>
                </MenuItem>
              </motion.div>
            ))}

            {/* Specialized Role Item */}
            <motion.div variants={itemVariants}>
              <MenuItem onClick={onClose} sx={menuItemStyle(theme)}>
                <ListItemIcon>
                  <VerifiedUserOutlined fontSize="small" />
                </ListItemIcon>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Role
                  </Typography>
                  <Chip
                    label={data.role}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      borderRadius: "6px",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      border: "none",
                    }}
                  />
                </Box>
              </MenuItem>
            </motion.div>
          </motion.div>

          {/* 2. Menu Items */}
          <Box sx={{ p: 1 }}>
            <MenuItem
              onClick={onClose}
              sx={{
                ...menuItemStyle(theme),
                // 2. Custom Ripple Color
                "& .MuiTouchRipple-child": {
                  backgroundColor: theme.palette.primary.main, // The ripple 'wave' color
                },
                "& .MuiTouchRipple-rippleVisible": {
                  opacity: 0.3, // Adjust intensity of the ripple
                },
              }}
            >
              <ListItemIcon>
                <SettingsOutlined fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                Settings
              </Typography>
            </MenuItem>

            {/* ROLE ITEM WITH CHIP (Your Specific Request) */}
            <MenuItem onClick={onClose} sx={menuItemStyle(theme)}>
              <ListItemIcon>
                <VerifiedUserOutlined fontSize="small" />
              </ListItemIcon>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Role
                </Typography>
                <Chip
                  label={data.role}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    borderRadius: "6px",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    border: "none",
                  }}
                />
              </Box>
            </MenuItem>

            <MenuItem onClick={onClose} sx={menuItemStyle(theme)}>
              <ListItemIcon>
                <ContactSupportOutlined fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                Support
              </Typography>
            </MenuItem>

            <MenuItem onClick={onClose} sx={menuItemStyle(theme)}>
              <ListItemIcon>
                <GitHub fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                Github
              </Typography>
            </MenuItem>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* 3. Theme Toggle Section */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PaletteOutlined fontSize="small" color="action" />
              <Typography variant="body2" fontWeight={500}>
                Theme
              </Typography>
            </Box>
            {/* Simple custom toggle UI placeholder */}
            <Box
              sx={{
                bgcolor: alpha(theme.palette.action.focus, 0.5),
                p: 0.5,
                borderRadius: "10px",
                display: "flex",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  p: 0.5,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: "6px",
                  boxShadow: 1,
                  display: "flex",
                }}
              >
                <SettingsOutlined sx={{ fontSize: 14 }} />
              </Box>
              <Box sx={{ p: 0.5, display: "flex", opacity: 0.5 }}>
                <SettingsOutlined sx={{ fontSize: 14 }} />
              </Box>
            </Box>
          </Box>
          {/* Logout Section (Staggered separately) */}
          <Box sx={{ p: 1 }}>
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate={open ? "open" : "closed"}
            >
              <MenuItem
                onClick={onClose}
                sx={{
                  ...menuItemStyle,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  color: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.12),
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" sx={{ color: "inherit" }} />
                </ListItemIcon>
                <Typography variant="body2" fontWeight={700}>
                  Logout
                </Typography>
              </MenuItem>
            </motion.div>
          </Box>

          {/* 4. Logout Section (Ref Image 1 Styling) */}
          <Box sx={{ p: 1, pb: 1.5 }}>
            <MenuItem
              onClick={onClose}
              sx={{
                ...menuItemStyle,
                bgcolor: alpha(theme.palette.error.main, 0.08),
                color: theme.palette.error.main,
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.12),
                },
              }}
            >
              <ListItemIcon>
                <LogoutOutlined fontSize="small" sx={{ color: "inherit" }} />
              </ListItemIcon>
              <Typography variant="body2" fontWeight={700}>
                Logout
              </Typography>
            </MenuItem>
          </Box>
        </Box>
      </Paper>
    </Popover>
  );
};

// --- Sub-components & Styles ---

// 1. Updated Menu Item Styles with Animation
const menuItemStyle = (theme: Theme) => ({
  borderRadius: "15px",
  mb: 0.5,
  py: 1,
  px: 1.5,
  position: "relative",
  overflow: "hidden", // Ensures ripple doesn't bleed out of rounded corners
  transition: theme.transitions.create(["all"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&:last-child": { mb: 0 },
  "& .MuiListItemIcon-root": {
    minWidth: "38px !important",
    transition: "color 0.2s ease",
  },

  // THE HOVER MAGIC
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: "translateX(4px)", // Slides the whole item to the right
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main, // Icon pops color on hover
    },
    "& .MuiTypography-root": {
      color: theme.palette.primary.main, // Text pops color too
    },
  },
});

const CircularProgressStatic = (inProps: CircularProgressProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const { value = 0, ...rest } = props;
  const theme = useTheme();
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        color="primary"
        enableTrackSlot
        size="2.5rem"
        variant="determinate"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color={value <= 50 ? "textSecondary" : "primary"}
        >{`${Math.round(value)}%`}</Typography>
      </Box>
      {/* <svg width="32" height="32" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={alpha(theme.palette.divider, 0.1)}
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          strokeDasharray={88}
          strokeDashoffset={88 - (88 * value) / 100}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg> */}
    </Box>
  );
};
