"use client";

import { useMemo } from "react";
import { MenuPopover, MenuSurface, Content, AccentBar, MenuDivider, MenuList, Footer, Action } from "./Settings.styles";
import type { UserMenuProps } from "@/interfaces/component-props.interface";
import { Typography, ListItemIcon, useTheme, CircularProgress, useMediaQuery } from "@mui/material";
import { SettingsOutlined, ContactSupportOutlined, LogoutOutlined, LoginOutlined, AccountCircleOutlined, DashboardOutlined, AssignmentTurnedInOutlined, AssessmentOutlined, EventAvailableOutlined, VerifiedOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useThemeProps } from "@mui/material/styles";
import ParticleContainer from "@/theme/effects/particle";
import options from "@/configs/particleConfig";
import AvatarContainer from "@/components/Avatar/AvatarContainer";
import CircularProgressStatic from "@/components/CustomComponents/CircularProgressStatic";
import MiniDashboard from "./MiniDashboard";
import { useRouter } from "next/navigation";
import { useLogout } from "@refinedev/core";
import { PublicAction, Header, Wrapper } from "./Settings.styles";
const PREFIX = "RazethUserSetting";
const containerVariants = {
  open: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.125
    }
  },
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};
const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25
    }
  },
  closed: {
    opacity: 0,
    x: -15
  }
};
export const UserMenu = (inProps: UserMenuProps) => {
  const theme = useTheme();
  const props = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    anchorEl,
    open,
    onClose,
    data,
    authenticated,
    authLoading = false
  } = props;
  const particleOptions = useMemo(() => options(theme, {
    repulse: {
      distance: 50,
      duration: 0.75
    }
  }, {
    onHover: {
      enable: true,
      mode: "repulse",
      parallax: {
        enable: true,
        force: 60,
        smooth: 10
      }
    }
  }, 20, "triangle"), [theme]);
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const {
    mutate: logout,
    isPending: isLoggingOut
  } = useLogout();
  const handleLogout = () => {
    onClose();
    logout();
  };
  const storagePercent = data?.storageUsed != null && data?.storageTotal != null && data.storageTotal > 0 ? data.storageUsed / data.storageTotal * 100 : undefined;
  const playOpenSound = () => {
    const audio = new Audio("/static/audios/click_004.ogg");
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };
  return <MenuPopover open={open} anchorEl={anchorEl} onClose={onClose} onTransitionEnter={playOpenSound} anchorOrigin={{
    vertical: "bottom",
    horizontal: "right"
  }} transformOrigin={{
    vertical: "bottom",
    horizontal: smallScreen ? "right" : "left"
  }}>

      <MenuSurface elevation={0}>

        <ParticleContainer id="menu-particles" options={particleOptions} />

        <Content>
          <AccentBar />

          {!authenticated && !authLoading && <Header>
              <Wrapper>
                <AvatarContainer src="/static/images/otto.webp" alt="Guest avatar" />
                <Typography variant="subtitle2">Guest</Typography>
              </Wrapper>
            </Header>}
          {authenticated && data && <Header>
              <Wrapper>
                <AvatarContainer role={data.role} size="small" src={data.avatar} alt={data.name} fallback={data.name?.charAt(0)} />
                <Typography variant="subtitle2" fontWeight={700}>
                  {data.name}

                  {data.isVerified && <VerifiedOutlined fontSize="inherit" color="primary" />}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.email}
                </Typography>
              </Wrapper>


              {storagePercent !== undefined && <MiniDashboard mainCaption={`${data.storageUsed} used of ${data.storageTotal}GB`} subCaption="Try pro plan" link="#">
                  <CircularProgressStatic value={storagePercent} />
                </MiniDashboard>}
            </Header>}

          <MenuDivider />


          <MenuList initial="closed" animate={open ? "open" : "closed"} variants={containerVariants}>

            {!authenticated && !authLoading && <motion.div variants={itemVariants}>
                <PublicAction onClick={() => {
              onClose();
              router.push("/hrd/contact");
            }}>
                  <ListItemIcon><ContactSupportOutlined fontSize="small" /></ListItemIcon>
                  <Typography variant="body2" fontWeight={500}>Contact us</Typography>
                </PublicAction>
              </motion.div>}
            {authenticated && [{
            label: "Profile",
            icon: <AccountCircleOutlined fontSize="small" />
          }, {
            label: "Dashboard",
            icon: <DashboardOutlined fontSize="small" />
          }, {
            label: "Tasks",
            icon: <AssignmentTurnedInOutlined fontSize="small" />
          }, {
            label: "Reports",
            icon: <AssessmentOutlined fontSize="small" />
          }, {
            label: "Calendar",
            icon: <EventAvailableOutlined fontSize="small" />
          }, {
            label: "Support",
            icon: <ContactSupportOutlined fontSize="small" />
          }, {
            label: "Settings",
            icon: <SettingsOutlined fontSize="small" />
          }].map(item => <motion.div key={item.label} variants={itemVariants}>
                  <Action onClick={onClose}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <Typography variant="body2" fontWeight={500}>
                      {item.label}
                    </Typography>
                  </Action>
                </motion.div>)}



          </MenuList>




          <MenuDivider />


          <Footer>
            <motion.div variants={itemVariants} initial="closed" animate={open ? "open" : "closed"}>
              <PublicAction data-auth-action onClick={authenticated ? handleLogout : () => {
              onClose();
              router.push("/login");
            }} disabled={authLoading || isLoggingOut}>
                <ListItemIcon>

                  {isLoggingOut ? <CircularProgress size={16} color="inherit" /> : authenticated ? <LogoutOutlined fontSize="small" color="inherit" /> : <LoginOutlined fontSize="small" color="inherit" />}
                </ListItemIcon>
                <Typography variant="body2" fontWeight={700} color="textPrimary">
                  {authLoading ? "Loading…" : isLoggingOut ? "Signing out..." : authenticated ? "Logout" : "Login"}
                </Typography>
              </PublicAction>
            </motion.div>
          </Footer>



        </Content>
      </MenuSurface>
    </MenuPopover>;
};
