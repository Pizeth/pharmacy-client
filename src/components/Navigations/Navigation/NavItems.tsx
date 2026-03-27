"use client";

import { usePathname } from "next/navigation";
// import { NavList, NavItem, NavLink, NavIcon, NavText, Indicator } from "./Navigation";

import RielIcon from "@/components/icons/riel";
// import { HomeIcon, PersonIcon, ChatIcon, CameraIcon, SettingsIcon } from "./icons";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import RazHome from "@/components/icons/home";
import RazPeople from "@/components/icons/people";
import RazContact from "@/components/icons/contact";
import { styled } from "@mui/material/styles";
import { indicatorSpin } from "@/theme/keyframes";
import Link from "next/link";
import { colorItemMixin, resolveColor } from "@/utils/themeUtils";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { he } from "date-fns/locale";
import { BorderRight } from "@mui/icons-material";
// import { Link } from "@mui/material";

const PREFIX = "RazethNav";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  flexGrow: 1,
  // position: "relative",
  // width: "400px",
  // height: "70px",
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  alignSelf: "stretch",
  // background: "#333",
  // borderRadius: "10px",
  // [theme.breakpoints.up("xs")]: {
  //   display: "none",
  // },
  // [theme.breakpoints.up("sm")]: {
  //   display: "block",
  // },
  // [theme.breakpoints.up("md")]: {
  //   display: "flex",
  // },
}));

const NavList = styled(List, {
  name: PREFIX,
  slot: "List",
  overridesResolver: (_props, styles) => styles.list,
})<{ variant?: "vertical" | "horizontal" }>(({ variant = "vertical" }) => ({
  position: "relative",
  // display: "inline-flex",
  display: variant === "vertical" ? "flex" : "block",
  height: "100%",
  padding: 0,
  margin: 0,
  listStyle: "none",
}));

const NavItem = styled(ListItem, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{ color: string; active?: boolean; variant?: "vertical" | "horizontal" }>(({
  theme,
  color,
  active,
  variant = "vertical",
}) => {
  // const resolved = resolveColor(color, theme); // 👈 resolve here
  const { resolved, gradient, border } = colorItemMixin(color, theme);
  return {
    position: "relative",
    listStyle: "none",
    // width: "70px",
    // height: "70px",
    zIndex: 1,
    cursor: "pointer",

    display: "inline-flex",
    float: "left",
    margin: 0,
    padding: 0,
    outline: 0,
    boxSizing: "border-box",
    verticalAlign: "middle",
    lineHeight: 1.75,
    textTransform: "uppercase",
    width: variant == "vertical" ? "fit-content" : "100%",
    justifyContent: variant == "vertical" ? "center" : "flex-start",
    // },
    // width: "fit-content",
    minWidth: "64px",
    // borderBottom: border,

    // icon transitions
    // "& .nav-icon": {
    //     color: active ? "#29fd53" : "rgba(255,255,255,0.5)",
    //     transform: active ? "translateY(-8px)" : "translateY(0)",
    //     transition: "0.5s",
    // },

    // text transitions
    // "& .nav-text": {
    //     transform: active ? "translateY(13px)" : "translateY(0px)",
    //     opacity: active ? 1 : 0,
    //     transition: "0.5s",
    // },
    // backgroundImage: `linear-gradient(to top, ${resolved} 50%, transparent 50%)`,
    backgroundImage: gradient,
    backgroundSize: "100% 200%",
    backgroundPosition: active ? "0 100%" : "0 0",
    transition: "background-position 0.5s",

    "&:active": {
      backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
    },

    "&:hover": {
      // backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
      a: { color: active ? "inherit" : resolved },
    },

    "&::after": {
      position: "absolute",
      bottom: 0,
      left: 0,
      content: "''",
      display: "block",
      //   width: variant == "vertical" ? 0 : "2.5px",
      //   height: variant == "vertical" ? "2.5px" : 0,
      background: resolved,
      transition: "width .3s",
    },

    "&:hover::after": {
      height: variant == "vertical" ? "2.5px" : "100%",
      //   borderRight: "2.5px solid white",
      width: variant == "vertical" ? "100%" : "2.5px",
      background: active ? "white" : resolved,
      backgroundPosition: "right",
      /* Size the width to 2.5px and height to fill the element */
      backgroundSize: "2.5px 100%",
    },
    svg: {
      // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
      color: active ? `oklch(from ${resolved} 1 0 h)` : resolved,
      // color: active ? `contrast-color(${resolved})` : resolved,
    },
  };
});

const VerticalNavItem = styled(ListItem, {
  name: PREFIX,
  slot: "SidebarItem",
  overridesResolver: (_props, styles) => styles.sidebarItem,
  shouldForwardProp: (prop) => prop !== "color" && prop !== "active",
})<{ color: string; active?: boolean }>(({ theme, color, active }) => {
  const { resolved, gradient, border } = colorItemMixin(color, theme);
  return {
    padding: 0,

    "& .MuiListItemButton-root": {
      // borderLeft: border,           // vertical uses left border instead of bottom
      backgroundImage: gradient,
      backgroundSize: "200% 100%", // flip axis for vertical slide
      backgroundPosition: active ? "100% 0" : "0 0",
      transition: "background-position 0.5s",

      "& .MuiListItemIcon-root": {
        color: active ? resolved : "inherit",
        transition: "color 0.3s",
      },
    },

    "& .MuiListItemButton-root:hover": {
      backgroundPosition: "100% 0",
      transition: "all 0.25s ease-in",
    },

    "&:active": {
      backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
    },

    "&:hover": {
      // backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
      a: { color: active ? "inherit" : resolved },
    },

    "&::after": {
      position: "absolute",
      bottom: 0,
      left: 0,
      content: "''",
      display: "block",
      width: 0,
      height: "2px",
      background: resolved,
      transition: "width .3s",
    },

    "&:hover::after": {
      width: "100%",
      background: active ? "white" : resolved,
    },
    svg: {
      // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
      color: active ? `oklch(from ${resolved} 1 0 h)` : resolved,
      // color: active ? `contrast-color(${resolved})` : resolved,
    },
  };
});

const NavLink = styled(Link, {
  name: PREFIX,
  slot: "Link",
  overridesResolver: (_props, styles) => styles.link,
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{ color: string; active?: boolean }>(({ theme, color, active }) => {
  const resolved = resolveColor(color, theme); // 👈 resolve here
  return {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "column",
    width: "100%",
    height: "100%",
    textAlign: "center",
    // fontWeight: 500,
    textDecoration: "none",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

    /* new style */
    // display: "inline-block",
    color: theme.palette.text.primary,
    fontSize: "1rem",
    // padding: "12.7px 12.7px",
    // boxSizing: "border-box",
    // height: "45px",
    // baked from `color` prop
    // borderBottom: `5px solid ${resolved}`,
    // backgroundImage: `linear-gradient(to top, ${resolved} 50%, transparent 50%)`,
    // backgroundSize: "100% 200%",
    // backgroundPosition: active ? "0 100%" : "0 0",
    // transition: "background-position 0.5s",

    // "&:active": {
    //     backgroundPosition: "0 100%",
    //     transition: "all 0.25s ease-in",
    // },

    "&:hover": {
      // backgroundPosition: "0 100%",
      // transition: "all 0.25s ease-in",
      //   color: active ? "inherit" : resolved,
      backgroundColor: "var(--app-palette-action-hover)",
    },
    // "&::after": {
    //     content: "''",
    //     display: "block",
    //     width: 0,
    //     height: "2px",
    //     background: resolved,
    //     transition: " width .3s",
    // },

    // "&:hover::after": {
    //     width: "100%",
    //     background: active ? "white" : resolved,
    // },

    // svg: {
    //     // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
    //     color: active ? `oklch(from ${resolved} 1 0 h)` : resolved,
    //     // color: active ? `contrast-color(${resolved})` : resolved,
    // },

    //     .dynamic - text {
    //     filter: invert(1) grayscale(1) contrast(999) brightness(1.5);
    //     mix - blend - mode: luminosity;
    // }

    "&:hover svg": {
      // color: "rgba(255,255,255,1)",
      // color: `oklch(from ${resolved} 1 0 h)`,
      // color: `oklch(from ${resolved} calc(l - 0.6) c h)`,
    },
  };
});

const NavIcon = styled(ListItemIcon, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
  // })(({ theme }) => ({
})<{ variant?: "vertical" | "horizontal" }>(
  ({ theme, variant = "vertical" }) => ({
    position: "relative",
    // display: "inline-flex",
    alignItems: "center",
    justifyContent: variant === "vertical" ? "center" : "left",
    // fontSize: "1.5em",
    // lineHeight: "75px",
    transition: "0.5s",
    // height: "75px",
    // display: "inherit",
    // marginRight: theme.spacing(1),
    // marginLeft: theme.spacing(-0.5),
    margin:
      variant === "vertical"
        ? `0 ${theme.spacing(1)} 0 ${theme.spacing(-0.5)}`
        : "0",
    minWidth: variant === "vertical" ? "fit-content" : theme.spacing(5),
    textShadow: `
            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${theme.custom.sideImage.captionGlowColor}
          `,
    // "-webkit-text-stroke": `0.125px ${props.theme.custom.sideImage.captionOutlineColor}`,
    WebkitTextStroke: `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
  }),
);

const NavText = styled(ListItemText, {
  name: PREFIX,
  slot: "Text",
  overridesResolver: (_props, styles) => styles.text,
})<{ variant?: "vertical" | "horizontal" }>(
  ({ theme, variant = "vertical" }) => ({
    // position: "absolute",
    // opacity: 0,
    // fontWeight: 600,
    // fontSize: "0.5em",
    // color: "#222327",
    transition: "0.25s",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transform: "translateY(0px)",
    textAlign: variant === "vertical" ? "center" : "left",
    // fontFamily: "'Poppins', sans-serif",
  }),
);

const Indicator = styled("div", {
  name: PREFIX,
  slot: "Indicator",
  overridesResolver: (_props, styles) => styles.indicator,
})<{ activeIndex: number }>(({ activeIndex }) => ({
  position: "absolute",
  width: "70px",
  height: "70px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "0.5s",
  transform: `translateX(calc(70px * ${activeIndex}))`,
  pointerEvents: "none",

  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "13px",
    width: "80%",
    height: "14px",
    background: "#29fd53",
    borderRadius: "10px",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "-3px",
    width: "7.5px",
    height: "7.5px",
    borderRadius: "50%",
    background: "#333",
    boxShadow:
      "0 0 0 2px #29fd53, 50px 50px #29fd53, 40px 0 #29fd53, 0 40px #29fd53",
    transform: "rotate(45deg)",
    animation: `${indicatorSpin} 2s ease -in -out infinite`,
  },
}));

const NAV_ITEMS = [
  {
    label: "ទំព័រដើម",
    Icon: <RazHome color="error" fontSize="medium" />,
    color: "error",
    href: "/",
  },
  {
    label: "ប្រព័ន្ធចរន្តឯកសារ",
    Icon: <ContentPasteSearchIcon color="secondary" fontSize="medium" />,
    color: "secondary",
    href: "/fts",
  },
  {
    label: "ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក",
    Icon: <RazPeople color="primary" fontSize="medium" />,
    color: "primary",
    href: "/hrm",
  },
  {
    label: "ប្រព័ន្ធគ្រប់គ្រងបៀវត្ស",
    Icon: <RielIcon color="success" fontSize="medium" />,
    color: "success",
    href: "/payrolls",
  },
  {
    label: "អំពីក្រសួង",
    Icon: <RazContact color="warning" fontSize="medium" />,
    color: "warning",
    href: "/about",
  },
];

export const NavItems = ({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) => {
  const pathname = usePathname();
  const activeIndex = NAV_ITEMS.findIndex((item) => item.href === pathname);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <Root>
      <NavList variant={variant}>
        {NAV_ITEMS.map(({ label, Icon, color, href }, i) => (
          // variant === "vertical" ?
          <NavItem
            key={label}
            color={color}
            active={resolvedIndex === i}
            variant={variant}
          >
            <NavLink href={href} color={color} active={resolvedIndex === i}>
              <NavIcon variant={variant}>{Icon}</NavIcon>
              {/* {Icon} */}
              <NavText
                primary={label}
                variant={variant}
                slotProps={{
                  primary:
                    variant === "vertical"
                      ? { variant: "h4" }
                      : { component: "span" },
                }}
              >
                {label}
              </NavText>
              {/* <Typography variant="h4" align="center">
                            {item.title}
                        </Typography> */}
              {/* <ListItemIcon>{Icon}</ListItemIcon> */}
              {/* <ListItemText primary={label} slotProps={{ primary: { variant: "h4" } }} /> */}
            </NavLink>
          </NavItem>
          // :
          // <VerticalNavItem key={label} color={color} active={resolvedIndex === i}>
          //     <ListItemButton component={Link} href={href}>
          //         <ListItemIcon>{Icon}</ListItemIcon>
          //         <ListItemText primary={label} />
          //     </ListItemButton>
          // </VerticalNavItem>
        ))}
        {/* <Indicator activeIndex={resolvedIndex} /> */}
      </NavList>
    </Root>
  );
};
