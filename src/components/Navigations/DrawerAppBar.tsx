// import AppBar from "@mui/material/AppBar";
import { Fragment, ReactNode, useState } from "react";
import {
  Avatar,
  Container,
  InputBase,
  Link,
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
import Button from "@mui/material/Button";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ThemeToggle from "../effect/themes/themeToggle";
import RielIcon from "../icons/riel";
import { navigate } from "next/dist/client/components/segment-cache/navigation";

// const drawerWidth = 250;
// 1. Define the responsive width once
const drawerWidth = "clamp(250px, 30vmin, 300px)";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  // padding: `0 ${theme.spacing(3)}`,
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
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  // justifyContent: "flex-end",
  justifyContent: "center",
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

const navItems = [
  { title: "ទំព័រដើម", icon: <HomeIcon /> },
  { title: "ប្រព័ន្ធចរន្តឯកសារ", icon: <ContentPasteSearchIcon /> },
  {
    title: "ប្រព័ន្ធគ្រប់គ្រងបៀវត្ស",
    icon: <RielIcon sx={{ color: "success" }} />,
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

  const drawer = (
    <Fragment>
      {/* <Box
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
      </Box> */}
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle} sx={{ height: "100%", p: 0 }}>
          <Box
            sx={{
              // display: { xs: "flex", md: "flex" },
              // mr: 1,
              position: "relative",
              width: "100vmin",
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
          </Box>
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
              <Box
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
              </Box>
              {/* <Avatar src="/static/images/logo.svg" /> */}
            </IconButton>
            {/* <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              MUI
            </Typography> */}
            <Box
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
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
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
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក
                </Typography>
              </Link>
            </Box>
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
