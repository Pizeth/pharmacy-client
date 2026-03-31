// import AppBar from "@mui/material/AppBar";
import { Fragment, ReactNode, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Container,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  // SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer, { DrawerProps } from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import ThemeToggle from "../effect/themes/themeToggle";
import RielIcon from "../icons/riel";
import RazHome from "../icons/home";
import { filt, hi, hii, wee } from "@/theme/keyframes";
import { makePulseKeyframes } from "@/utils/themeUtils";
import NavigationMenu from "./Navigation/NavigationMenu";
import RazPeople from "../icons/people";
import RazContact from "../icons/contact";
import DrawerToggle from "./Navigation/DrawerToggle";
import MiniImg from "./Navigation/MiniImg";
import { NavItems } from "./Navigation/NavItems";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import RazFacebook from "../icons/socials/facebook";
import RazTelegram from "../icons/socials/telegram";
import RazYoutube from "../icons/socials/youtube";
import RazInstagram from "../icons/socials/instagram";
import RazWebsite from "../icons/socials/website";
import RazTiktok from "../icons/socials/tiktok";
import RazX from "../icons/socials/x";
import options from "@/configs/particleConfig";
import { Height, Padding } from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import GlobalSearch from "./Search/search";
import { UserMenu } from "./UserSetting/settings";
import ParticleContainer from "@/theme/effects/particle";
// const drawerWidth = 250;

const PREFIX = "RazethDrawer";
// 1. Define the responsive width once
const drawerWidth = "clamp(250px, 30vmin, 300px)";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  // width: drawerWidth,
  // [theme.breakpoints.up("sm")]: {
  //   width: drawerWidth,
  //   flexShrink: 0,
  // },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  /* Addition Style for particles */
  // height: "100px",
  justifyContent: "center",
  // Your Red Gradient
  // background: "linear-gradient(45deg, rgb(187, 17, 17) 0%, #820000 100%)",
  // position: "relative",
  // ❌ Remove this — it corrupts Menu positioning
  // overflow: "hidden", // Keeps particles inside the bar
  boxShadow: "none",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        // width: `calc(100% - ${drawerWidth}px)`,
        // marginLeft: `${drawerWidth}px`,

        // 2. Use it directly for margin (negative values work too!)
        marginLeft: `${drawerWidth}`,

        // 3. Subtract it from 100% for the main content width
        width: `calc(100% - ${drawerWidth})`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const AppBarContainer = styled(Container)(({ theme }) => ({
  // display: "flex",
  // flexDirection: "column",
  // height: "100%",
  // overflow: "hidden",
  position: "relative",
  zIndex: 10,
  padding: 0,
  [theme.breakpoints.up("xs")]: {
    padding: 0,
  },
  // [theme.breakpoints.up("sm")]: {
  //   padding: 0,
  // },
  // [theme.breakpoints.up("md")]: {
  //   padding: 0,
  // },
  // [theme.breakpoints.up("lg")]: {
  //   padding: 0,
  // },
  // [theme.breakpoints.up("xl")]: {
  //   padding: 0,
  // },
}));

// const ParticleContainer = styled(Box, {
//   name: PREFIX,
//   slot: "effect",
//   overridesResolver: (_props, styles) => styles.effect,
// })(({ theme }) => ({
//   position: "absolute",
//   inset: 0,
//   overflow: "hidden",
//   zIndex: 0,
// }));

const ProfileToolBar = styled(Toolbar, {
  name: PREFIX,
  slot: "Toolbar",
  overridesResolver: (_props, styles) => styles.toolbar,
})(({ theme }) => ({
  padding: `${theme.spacing(0.5)} 0`,
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
}));

const LogoSection = styled(Box, {
  name: PREFIX,
  slot: "LogoSection",
  overridesResolver: (_props, styles) => styles.logoSection,
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  alignContent: "middle",
}));

const LogoCaption = styled(Box, {
  name: PREFIX,
  slot: "Caption",
  overridesResolver: (_props, styles) => styles.caption,
})(({ theme }) => ({
  textAlign: "center",
  h6: {
    Padding: `${theme.spacing(0.5)} 0`,
    lineHeight: 2.5,
    fontSize: { xs: "0.75rem", md: "0.925rem" },
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    [theme.breakpoints.up("xs")]: {
      fontSize: "0.75rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "0.925rem",
    },
  },
}));

const CaptionWrapper = styled(Stack, {
  name: PREFIX,
  slot: "CaptionWrapper",
  overridesResolver: (_props, styles) => styles.captionWrapper,
})(({ theme }) => ({
  display: "inline-block",
  position: "relative",
  h6: {
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    fontWeight: 500,
  },
}));

const Underline = styled(Box, {
  name: PREFIX,
  slot: "Underline",
  overridesResolver: (_props, styles) => styles.underline,
})(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "4px", // The maximum thickness in the middle
  backgroundColor: "#fdb913", // The official MPTC gold/orange

  /* This Clip-Path creates the "tapered" look:
         Starts thin at the left, gets thick in the middle,
         and ends thin at the right.
      */
  clipPath:
    "polygon(0% 80%, 15% 40%, 50% 10%, 85% 40%, 100% 80%, 85% 100%, 50% 100%, 15% 100%)",

  // Adds a very slight "glow" to mimic the site's look
  filter: "drop-shadow(0px 0px 2px rgba(253, 185, 19, 0.5))",
}));

const StackWrapper = styled(Stack, {
  name: PREFIX,
  slot: "StackWrapper",
  overridesResolver: (_props, styles) => styles.stackWrapper,
})(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    display: "none",
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  button: {
    color: "inherit",
  },
}));

const DesktopToolbar = styled(Toolbar, {
  name: PREFIX,
  slot: "DesktopToolbar",
  overridesResolver: (_props, styles) => styles.desktopToolbar,
})(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    display: "none",
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up("xs")]: {
    paddingTop: theme.spacing(5),
  },
  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(10),
  },
  // // padding: `0 ${theme.spacing(3)}`,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // marginLeft: `-${drawerWidth}px`,
  marginLeft: `calc(-1 * ${drawerWidth})`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    // minWidth: 230,
    // maxWidth: 300,
    display: "flex",
    flexDirection: "column",
    Height: "100%",
    background: `
      linear-gradient(135deg, 
      ${alpha(theme.palette.primary.main, 0.1)}, 
      ${alpha(theme.palette.secondary.main, 0.1)})
    `,
  },
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
  [theme.breakpoints.up("xs")]: {
    display: "block",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  alignSelf: "stretch",
  // padding: theme.spacing(0, 1),
  padding: 0,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  // justifyContent: "flex-end",
  justifyContent: "center",
  // button: {
  //   padding: 0,
  // },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  borderRadius: 50,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    svg: {
      fill: theme.palette.error.main,
    },
  },
  // marginRight: theme.spacing(2),
  // marginLeft: "auto",
  margin: theme.spacing(0.75, 1),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "10ch",
      "&:focus": {
        width: "100%",
      },
    },
  },
}));

const NavMenuButton = styled(IconButton, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
  shouldForwardProp: (prop) => prop !== "visible",
})<{ variant?: "main" | "side"; visible?: boolean }>(
  ({ theme, variant = "main", visible = true }) => ({
    alignSelf: "stretch",
    // minHeight: "61.55px",
    height: "fill-available",
    width: variant === "main" ? "fit-content" : "stretch",
    // padding: `${theme.spacing(1)}`,
    padding: 0,
    opacity: visible === true ? 1 : 0,
    // margin: `${theme.spacing(1)}`,
    // "&:hover": {
    //   svg: {
    //     opacity: 1,
    //   },
    // },
  }),
);

const HamBurgerNav = styled(Box)(({ theme }) => ({
  // display: { xs: "flex", md: "flex" },
  mr: 1,
  position: "relative",
  width: "100%",
  // height: `max(40px, 7vmin)`,
  height: "fill-available",
  justifyContent: "center",
  justifyItems: "center",
  alignContent: "center",
  alignItems: "center",
  // img: {
  //   p: 0.5,
  // },
  [theme.breakpoints.up("xs")]: {
    display: "flex",
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    "--c": "7px",
    backgroundColor: "#000",
    backgroundImage: `
                radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
                radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
                radial-gradient(circle at 50% 50%, #f00, #f000 60%),
                radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
                radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
                radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
              `,
    backgroundSize: `
                12px 20.7846097px,
                12px 20.7846097px,
                200% 200%,
                200% 200%,
                200% 200%,
                200% 20.7846097px
              `,
    "--p": "0px 0px, 6px 10.39230485px",
    backgroundPosition: `
                var(--p),
                0% 0%,
                0% 0%,
                0% 0px
              `,
    animation: `${wee} 40s linear infinite, ${filt} 6s linear infinite`,
    zIndex: 0,
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  // flexGrow: 1,
  // display: { xs: "flex", sm: "block" },
  // mr: 1,
  // position: "relative",
  // width: `max(40px, 7vmin)`,
  // height: `max(40px, 7vmin)`,
  // img: {
  //   p: 0.5,
  // },

  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  // width: "7.5%", // one-third of parent width
  height: "97.5%",
  aspectRatio: "1 / 1", // keep height equal to width
  // paddingTop: "var(--app-sideImage-circleSize)", // makes height equal to width
  // backgroundImage:
  //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle
  // backgroundSize: "100% 100%",
  // backgroundBlendMode: "multiply",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // center it
  // boxShadow: "0 0 20px 10px rgba(30, 64, 175, 0.5)",
  boxShadow: `0 0 20px 10px ${theme.palette.primary.main}50`,
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    // backgroundImage:
    //   props.theme.custom.sideImage.circleColor || "#02020280", // blue circle

    // zIndex: 0, // keep it behind children
    // pointerEvents: "none", // don’t block clicks
    // background: `radial-gradient(
    //   circle,
    //       ${props.theme.custom.sideImage.circleColor} ${
    //   props.theme.custom.sideImage.circleSoftStop
    // },
    //   transparent ${props.theme.custom.sideImage.circleSoftFade}
    //   // ${props.theme.custom.sideImage.circleColor || "#1e40af"} 70%,
    //   // transparent 100%
    // )`,
    // backgroundImage: `radial-gradient(
    //   circle at 50% 50%,
    //   ${makeRadialStops(
    //     props.theme.custom.sideImage.circleColor,
    //     props.theme.custom.sideImage.circleStopCount,
    //     props.theme.custom.sideImage.maxOpacity
    //   )}
    // )`,
    animation: `${makePulseKeyframes(
      theme.custom.sideImage.circlePulseSequence,
    )} ${theme.custom.sideImage.circlePulseDuration} ease-in-out infinite`,
    // backgroundSize: "100% 100%",
  },

  /*** Animation ***/
  // "--c": "#09f",
  backgroundColor: "#000",
  backgroundImage: theme.custom.sideImage.animationBackground.backgroundImage,
  backgroundSize: theme.custom.sideImage.animationBackground.backgroundSize,

  animation: `${hi} 150s linear infinite`,
  "&::after": {
    content: "''",
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
    "--f": "blur(1em) brightness(6)",
    animation: `${hii} 10s linear infinite`,
  },
}));

const DrawerDivider = styled(Divider)(({ theme }) => ({
  // margin: theme.spacing(1, 0),
  height: theme.spacing(1),
  backgroundColor: "#000",
}));

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const SOCIAL_ITEMS = [
  {
    label: "គេហទំព័រ",
    Icon: <RazWebsite color="inherit" fontSize="medium" />,
    color: "error",
    href: "https://www.mcs.gov.kh/",
  },
  {
    label: "Facebook",
    Icon: <RazFacebook color="inherit" fontSize="medium" />,
    color: "secondary",
    href: "https://www.facebook.com/CivilServiceCambodia",
  },
  {
    label: "Instagram",
    Icon: <RazInstagram color="inherit" fontSize="medium" />,
    color: "primary",
    href: "https://www.instagram.com/civilservice_cambodia",
  },
  {
    label: "Telegram",
    Icon: <RazTelegram color="inherit" fontSize="medium" />,
    color: "success",
    href: "https://t.me/mcsgovkh",
  },
  {
    label: "Tiktok",
    Icon: <RazTiktok color="inherit" fontSize="medium" />,
    color: "warning",
    href: "https://www.tiktok.com/@mcsgovernment",
  },
  {
    label: "X",
    Icon: <RazX color="inherit" fontSize="medium" />,
    color: "warning",
    href: "/about",
  },
  {
    label: "YouTube",
    Icon: <RazYoutube color="inherit" fontSize="medium" />,
    color: "warning",
    href: "https://youtube.com/@MinistryofCivilService",
  },
];

export const DrawerAppBar = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [init, setInit] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  // const [results, setResults] = useState<any[]>([]);

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(open);
  };

  const drawer = (
    <Fragment>
      <DrawerHeader>
        <NavMenuButton onClick={handleDrawerToggle} variant="side">
          <HamBurgerNav
          // sx={{
          //   // display: { xs: "flex", md: "flex" },
          //   // mr: 1,
          //   position: "relative",
          //   width: "100vmin",
          //   // height: `max(40px, 7vmin)`,
          //   height: "fill-available",
          //   img: {
          //     p: 0.5,
          //   },
          // }}
          >
            <DrawerToggle>
              <MiniImg />
            </DrawerToggle>
          </HamBurgerNav>
        </NavMenuButton>
      </DrawerHeader>
      <DrawerDivider />
      {/* <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search> */}
      <GlobalSearch />
      {/* <Divider /> */}
      <NavItems variant="horizontal" />

      {/* Bottom items container - automatically pushed to the bottom */}
      <Box
        sx={{
          marginTop: "auto",
          p: 1.5,
          borderTop: "1px solid #404040", // Optional divider
        }}
      >
        {/* The "New Version" Update Card (optional) */}
        <Box
          sx={{
            bgcolor: "#272935",
            p: 2,
            borderRadius: 2,
            mb: 2,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Typography variant="caption" sx={{ color: "#fff", fontWeight: 600 }}>
            Legacy version available
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.75rem",
              mt: 0.5,
            }}
          >
            The legacy version of the App is available.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#6366f1",
              mt: 1,
              display: "block",
              cursor: "pointer",
            }}
          >
            Switch now →
          </Typography>
        </Box>

        {/* The Profile Section */}
        <ListItemButton
          sx={{
            borderRadius: 2,
            px: 0,
            "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
          }}
          onClick={handleOpenUserMenu}
        >
          <Avatar
            src="/static/images/otto.webp"
            alt="User"
            sx={{
              width: 50,
              height: 50,
              mr: 1,
              p: 0.125,
              // borderRadius: "12px",
              border: "1px solid rgba(197, 190, 190, 0.73)",
            }} // Squircle avatar
          />
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography
              variant="body2"
              sx={{ color: "#fff", fontWeight: 500, lineHeight: 1.2 }}
            >
              Liam Smith
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.5)",
                display: "block",
                // noWrap: true,
              }}
              noWrap
            >
              smith@example.com
            </Typography>
          </Box>
          <SettingsIcon
            fontSize="medium"
            sx={{ color: "rgba(255,255,255,0.4)", mr: 0.5 }}
          />
        </ListItemButton>

        {/* The Popup Menu */}
        {/* <Menu
          // sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          // anchorOrigin={{
          //   vertical: "bottom",
          //   horizontal: "right",
          // }}
          // transformOrigin={{
          //   vertical: "top",
          //   horizontal: "right",
          // }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#1c1e26", // Match drawer background
                // color: "#fff",
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.1)",
                // mt: -1, // Adjust vertical offset
                width: "clamp(150px, 80%, 250px)",
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  borderRadius: "6px",
                  mx: 1,
                  my: 0.5,
                },
              },
            },
          }}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography align="center">{setting}</Typography>
            </MenuItem>
          ))}
        </Menu> */}
        <UserMenu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          data={{
            name: "Piseth Chesda",
            email: "piseth@example.com",
            role: "Admin",
            avatar: "/static/images/otto.webp",
            storageUsed: 150,
            storageTotal: 200,
          }}
        />
      </Box>
    </Fragment>
  );

  // 1. Initialize the engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <Root>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        component="nav"
        enableColorOnDark
      >
        <Container maxWidth="xl">
          {/* 2. The Particles Canvas */}
          {init && <ParticleContainer id="tsparticles" options={options()} />}
          {/* Content Container (Above Canvas) */}
          <AppBarContainer maxWidth="xl">
            {/* --- SECTION 2: LOGO & TITLE --- */}
            <ProfileToolBar disableGutters variant="dense">
              <LogoSection>
                {/* Logo Image */}
                <NavMenuButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  visible={!open}
                  // sx={[
                  //   { mr: 2, p: 0.5 },
                  //   open && { display: { xs: "none", sm: "block" } },
                  // ]}
                >
                  {/* <MenuIcon /> */}
                  <DrawerToggle>
                    <MiniImg />
                  </DrawerToggle>
                </NavMenuButton>

                {/* Logo Title */}
                <LogoCaption>
                  <CaptionWrapper>
                    <Typography variant="h6">អគ្គលេខាធិការដ្ឋាន</Typography>

                    {/* The Orange Tapered Underline (Swoosh) */}
                    <Underline />
                  </CaptionWrapper>
                  <Typography variant="h6">General Secretariat</Typography>
                </LogoCaption>
              </LogoSection>

              {/* --- SECTION 3: NAVIGATION MENU --- */}
              <StackWrapper direction="row" spacing={1}>
                {/* <Button color="inherit" sx={{ fontWeight: 600 }}>
                  Home
                </Button>
                <Button color="inherit" sx={{ fontWeight: 600 }}>
                  About Us
                </Button>
                <Button color="inherit" sx={{ fontWeight: 600 }}>
                  News
                </Button>
                <Button color="inherit" sx={{ fontWeight: 600 }}>
                  Contact
                </Button> */}
                {SOCIAL_ITEMS.map(({ label, Icon, color, href }, i) => (
                  <Tooltip title={label} key={label}>
                    <IconButton
                      href={href}
                      target="_blank"
                      size="small"
                      color="inherit"
                    >
                      {Icon}
                    </IconButton>
                  </Tooltip>
                ))}
                {/* <IconButton size="small">
                  <RazWebsite />
                </IconButton>
                <IconButton size="small">
                  <RazFacebook />
                </IconButton>
                <IconButton size="small">
                  <RazInstagram />
                </IconButton>
                <IconButton size="small">
                  <RazTelegram />
                </IconButton>
                <IconButton size="small">
                  <RazTiktok />
                </IconButton>
                <IconButton size="small">
                  <RazX />
                </IconButton>
                <IconButton size="small">
                  <RazYoutube />
                </IconButton> */}
                {/* <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <ThemeToggle />
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open User's settings">
                    <IconButton
                      size="small"
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0 }}
                    >
                      <Avatar alt="MCS" src="/static/images/otto.webp" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    // sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    // PopperProps={{
                    //   // ← THIS IS THE KEY FIX
                    //   strategy: "fixed",
                    // }}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography align="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box> */}
              </StackWrapper>
            </ProfileToolBar>
          </AppBarContainer>
          <DesktopToolbar disableGutters variant="dense">
            {/* Pass The Drawer Button back here to revert back */}
            <NavItems />
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <ThemeToggle />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="MCS" src="/static/images/otto.webp" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
          </DesktopToolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        // onOpen={toggleDrawer}
        // ModalProps={{
        //   keepMounted: true, // Better open performance on mobile.
        // }}
      >
        {drawer}
      </Drawer>
      <Main open={open}>
        {/* <DrawerHeader /> */}
        {children}
      </Main>
    </Root>
  );
};

export default DrawerAppBar;

{
  /* <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onOpen={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </nav> */
}
