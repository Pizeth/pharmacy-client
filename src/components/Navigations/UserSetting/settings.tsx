"use client";
import {
  Box,
  Typography,
  Divider,
  MenuItem,
  ListItemIcon,
  Paper,
  Popover,
  alpha,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ContactSupportOutlined,
  PaletteOutlined,
  LogoutOutlined,
  VerifiedUserOutlined,
  AccountCircle,
  Dashboard,
  AssignmentTurnedIn,
  EventAvailable,
  Assessment,
  Verified,
  GppGood,
  GppGoodOutlined,
  LocalPolice,
  AccountCircleOutlined,
  DashboardOutlined,
  AssignmentTurnedInOutlined,
  AssessmentOutlined,
  EventAvailableOutlined,
  LocalPoliceOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import BounceTransition from "@/theme/effects/animation";
import { motion } from "framer-motion";
import { styled, Theme, useThemeProps } from "@mui/material/styles";
import { UserMenuProps } from "@/interfaces/component-props.interface";
import ParticleContainer from "@/theme/effects/particle";
import options from "@/configs/particleConfig";
import MiniImg from "../Navigation/MiniImg";
import AvatarContainer from "./AvatarContainer";
import CircularProgressStatic from "@/components/CustomComponents/CircularProgressStatic";
import MiniDashboard from "./MiniDashboard";
import AvatarWrapper from "@/components/CustomComponents/AvatarWrapper";
import AvatarFrame from "@/components/CustomComponents/AvatarFrame";
// import ThemeToggle from "@/components/CustomComponents/DaynightSwitch";
import ThemeToggle from "@/components/effect/themes/themeToggle";

const PREFIX = "RazethUserSetting";

const Header = styled(Box, {
  name: PREFIX,
  slot: "Header",
  overridesResolver: (_props, styles) => styles.header,
})(({ theme }) => ({ padding: theme.spacing(2.5, 0) }));

const Wrapper = styled(Box, {
  name: PREFIX,
  slot: "Wrapper",
  overridesResolver: (_props, styles) => styles.wrapper,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& .MuiTypography-root": {
    // lineHeight: 1.5,
    svg: {
      marginLeft: theme.spacing(0.25),
    },
  },
}));

// const Chip = styled(MuiChip, {
//   name: PREFIX,
//   slot: "Chip",
//   overridesResolver: (_props, styles) => styles.chip,
// })(({ theme }) => ({
//   // width: "fit-content",
//   // display: "flex-content",
//   // padding: theme.spacing(0),
//   marginTop: theme.spacing(5),
//   height: "1.25rem",
//   fontSize: "0.725rem",
//   fontWeight: 900,
//   textTransform: "uppercase",
//   borderRadius: "50px",
//   backgroundColor: alpha(theme.palette.primary.main, 0.925),
//   // color: theme.palette.primary.main,
//   color: theme.palette.text.primary,
//   border: "none",
//   zIndex: 99,
// }));

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
          // elevation: 3,
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
        elevation={0}
        sx={{
          borderRadius: "25px",
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: "relative",
          // 2. Glassmorphism Secret Sauce
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(20px) saturate(180%)",
          // border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
        }}
      >
        {/* 3. Particle Background Layer */}
        <ParticleContainer
          id="menu-particles"
          options={options(
            theme,
            {
              repulse: {
                distance: 50,
                duration: 0.75,
              },
            },
            {
              onHover: {
                enable: true,
                mode: "repulse",
                parallax: { enable: true, force: 60, smooth: 10 },
              },
            },
            20,
            "triangle",
          )}
        />
        {/* 4. Content Layer (zIndex ensures text is above particles) */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              width: "75%",
              height: "0.35rem",
              // background: "#6b64f3",
              background: (theme) =>
                `linear-gradient(315deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
              margin: "auto",
              borderRadius: "0 0 25px 25px",
            }}
          />
          {/* 1. Profile Header */}
          <Header>
            <Wrapper>
              <AvatarContainer role={data.role} size="small">
                <AvatarFrame>
                  <AvatarWrapper>
                    <MiniImg src={data.avatar} />
                  </AvatarWrapper>
                </AvatarFrame>
              </AvatarContainer>
              <Typography variant="subtitle2" fontWeight={700}>
                {data.name}
                {/* <VerifiedUserOutlined fontSize="small" /> */}
                <VerifiedOutlined
                  fontSize="small"
                  color="primary"
                  // sx={{ ml: 0.25 }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.email}
              </Typography>
            </Wrapper>

            {/* Storage Bar (Ref Image 1) */}
            <MiniDashboard
              mainCaption={`${data.storageUsed} used of ${data.storageTotal}GB`}
              subCaption="Try pro plan"
              link="#"
            >
              <CircularProgressStatic value={storagePercent} />
            </MiniDashboard>
          </Header>

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
                label: "Profile",
                icon: <AccountCircleOutlined fontSize="small" />,
              },
              {
                label: "Dashboard",
                icon: <DashboardOutlined fontSize="small" />,
              },
              {
                label: "Tasks",
                icon: <AssignmentTurnedInOutlined fontSize="small" />,
              },
              {
                label: "Reports",
                icon: <AssessmentOutlined fontSize="small" />,
              },
              {
                label: "Calendar",
                icon: <EventAvailableOutlined fontSize="small" />,
              },
              {
                label: "Support",
                icon: <ContactSupportOutlined fontSize="small" />,
              },
              {
                label: "Settings",
                icon: <SettingsOutlined fontSize="small" />,
              },
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
            {/* <motion.div variants={itemVariants}>
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
            </motion.div> */}
          </motion.div>

          {/* 2. Menu Items */}
          {/* <Box sx={{ p: 1 }}>
            <MenuItem
              onClick={onClose}
              sx={{
                ...menuItemStyle(theme),
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
          </Box> */}

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* 3. Theme Toggle Section */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
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
            // sx={{
            //   bgcolor: alpha(theme.palette.action.focus, 0.5),
            //   p: 0.5,
            //   borderRadius: "10px",
            //   display: "flex",
            //   gap: 0.5,
            // }}
            >
              {/* <Box
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
              </Box> */}
              <ThemeToggle />
            </Box>
          </Box>
          {/* Logout Section (Staggered separately) */}
          <Box sx={{ p: 1, pb: 1.5 }}>
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate={open ? "open" : "closed"}
            >
              <MenuItem
                onClick={onClose}
                sx={{
                  ...menuItemStyle,
                  borderRadius: "50px",
                  bgcolor: alpha(theme.palette.primary.main, 0.075),
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.125),
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
          {/* <Box sx={{ p: 1, pb: 1.5 }}>
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
          </Box> */}
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

  // 2. Custom Ripple Color
  "& .MuiTouchRipple-child": {
    backgroundColor: theme.palette.primary.main, // The ripple 'wave' color
  },
  "& .MuiTouchRipple-rippleVisible": {
    opacity: 0.3, // Adjust intensity of the ripple
  },
});
