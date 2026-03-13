// import AppBar from "@mui/material/AppBar";
import { Fragment, ReactNode, useState } from "react";
import {
  Avatar,
  Container,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
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

// const drawerWidth = 250;
// 1. Define the responsive width once
const drawerWidth = "clamp(250px, 30vmin, 300px)";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    // minWidth: 230,
    // maxWidth: 300,
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
  button: {
    padding: 0,
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  borderRadius: 50,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
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
        width: "25ch",
      },
    },
  },
}));

const NavMenuButton = styled(IconButton)(({ theme }) => ({
  alignSelf: "stretch",
  minHeight: "61.55px",
  height: "fill-available",
}));

const HamBurgerNav = styled(Box)(({ theme }) => ({
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

// const navItems = [
//   { title: "ទំព័រដើម", icon: <RazHome color="error" fontSize="medium" /> },
//   {
//     title: "ប្រព័ន្ធចរន្តឯកសារ",
//     icon: <ContentPasteSearchIcon color="secondary" fontSize="medium" />,
//   },
//   {
//     title: "ប្រព័ន្ធគ្រប់គ្រងបៀវត្ស",
//     icon: <RielIcon color="success" fontSize="medium" />,
//   },
// ];

const navItems = [
  {
    title: "ទំព័រដើម",
    icon: <RazHome color="error" fontSize="medium" />,
    href: "/",
  },
  {
    title: "ប្រព័ន្ធចរន្តឯកសារ",
    icon: <ContentPasteSearchIcon color="secondary" fontSize="medium" />,
    href: "/fts",
  },
  {
    title: "ប្រព័ន្ធគ្រប់គ្រងបៀវត្ស",
    icon: <RielIcon color="success" fontSize="medium" />,
    href: "/payrolls",
  },
  {
    title: "ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក",
    icon: <RazPeople color="primary" fontSize="medium" />,
    href: "/photos",
  },
  {
    title: "អំពីក្រសួង",
    icon: <RazContact color="warning" fontSize="medium" />,
    href: "/about",
  },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

export const DrawerAppBar = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen((prevState) => !prevState);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
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
  {
    /* <Box
        sx={{
          display: { xs: "flex", md: "flex" },
          //   alignItems: "center",
          //   justifyContent: "center",
          mr: 1,
          position: "relative",
          //   width: "7vmin",
          height: "7vmin",
        }}
      >
        <Image
          src="/static/images/logo.svg"
          alt="Logo"
          preload={false}
          loading="eager"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </Box> */
  }
  const drawer = (
    <Fragment>
      <DrawerHeader>
        <NavMenuButton onClick={handleDrawerToggle}>
          <HamBurgerNav
            sx={{
              // display: { xs: "flex", md: "flex" },
              // mr: 1,
              position: "relative",
              width: "100vmin",
              // height: `max(40px, 7vmin)`,
              height: "fill-available",
              img: {
                p: 0.5,
              },
            }}
          >
            <Logo />
            <Image
              src="/static/images/logo.svg"
              alt="Logo"
              preload={false}
              loading="eager"
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </HamBurgerNav>
        </NavMenuButton>
      </DrawerHeader>
      <Divider />
      {/* <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
      <NavItems variant="horizontal" />
    </Fragment>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" component="nav">
        <Container maxWidth="xl">
          <Toolbar disableGutters variant="dense">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={[
                { mr: 2, p: 0.5 },
                open && { display: { xs: "none", sm: "block" } },
              ]}
            >
              {/* <MenuIcon /> */}
              {/* <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", sm: "block" },
                  // mr: 1,
                  position: "relative",
                  width: `max(40px, 7vmin)`,
                  height: `max(40px, 7vmin)`,
                  img: {
                    p: 0.5,
                  },
                }}
              >
                <Image
                  src="/static/images/logo.svg"
                  alt="Logo"
                  preload={false}
                  loading="eager"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </Box> */}
              <DrawerToggle>
                {/* <img src="/static/images/logo.svg" alt="Logo" /> */}
                <MiniImg />
              </DrawerToggle>

              {/* <Avatar src="/static/images/logo.svg" /> */}
            </IconButton>
            {/* <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              MUI
            </Typography> */}
            {/* <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  sm: "block",
                  md: "flex",
                  // height: "100%",
                },
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.title}
                  sx={{
                    my: "-webkit-fill-available",
                    py: "-webkit-fill-available",
                    height: "100%",
                  }}
                  startIcon={item.icon}
                  size="large"
                >
                  <Typography variant="h4" align="center">
                    {item.title}
                  </Typography>
                </Button>
              ))}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  window.location.href = "/staff";
                }}
              >
                <Typography variant="h4" align="center">
                  ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក
                </Typography>
              </Link>
            </Box> */}
            <NavItems />
            <Search>
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
            </Box>
          </Toolbar>
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
    </Box>
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
