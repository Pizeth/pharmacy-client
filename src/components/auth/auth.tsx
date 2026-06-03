// Auth.tsx
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  styled,
  Typography,
  useTheme,
  useThemeProps,
} from "@mui/material";
import { useIsAuthenticated, useLogin } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  loginSchema,
  registerSchema,
  LoginValues,
  RegisterValues,
} from "@/schema/auth.schema";
import authService from "@/services/auth.service";
import {
  cloudMove,
  fadeIn,
  fadeOut,
  move,
  moveBackgroundLeft,
  twinkle,
} from "@/theme/keyframes";
import { Instagram, Meta, Telegram, YouTube } from "../icons/socialIcons";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProps } from "@/interfaces/component-props.interface";
import AuthForm from "./ui/authForm";
import { EffectProps } from "@/interfaces/auth.interface";
import AuthNavigationLink from "./ui/authNavaigation";
import SocialButton from "../icons/components/socialButton";
import ShootingStars from "./effects/shootingStars";
import SideImage from "./sideImage";
import MeteorShower from "./effects/meteors";
import AvatarHeader from "./avatar";
import RocketAnimation from "./effects/rocket";
import TwinkleStars from "./effects/twinkleStars";
import SocialLogin from "./socialLogin";
import Footer from "./ui/footer";
import Divider from "./divider";
import { AuthAction } from "@/types/auth";
import ThemeToggle from "../effect/themes/themeToggle";
import { MCS } from "../icons/socials/mcs";
import Icons from "../icons/components/socials";
import ParticleHexBackground from "../effect/backgrounds/particleHex";

const PREFIX = "RazethAuth";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthProps>(({ theme }) => ({
  cursor: "url(/static/cursors/yellow.svg), auto",
  // backgroundImage: `
  //   repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
  //   repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
  //   repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
  // `,
  // backgroundSize: "24px 24px, 24px 24px, 8px 8px",
  background: `
    radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
    radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
    radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
    radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
    radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
    #000000
  `,
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `
      repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
      repeating-linear-gradient(45deg, rgba(0,255,128,0.09) 0, rgba(0,255,128,0.09) 1px, transparent 1px, transparent 20px),
      repeating-linear-gradient(-45deg, rgba(255,0,128,0.10) 0, rgba(255,0,128,0.10) 1px, transparent 1px, transparent 30px),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
      radial-gradient(circle at 60% 40%, rgba(0,255,128,0.05) 0, transparent 60%)
    `,
    backgroundSize: "80px 80px, 40px 40px, 60px 60px, 80px 80px, 100% 100%",
    backgroundPosition: "0 0, 0 0, 0 0, 40px 40px, center",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none", // don't block interaction
    backgroundImage: `
      repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
      repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
    `,
  },
}));

const Overlay = styled(Box, {
  name: PREFIX,
  slot: "Overlay",
  overridesResolver: (_props, styles) => styles.overlay,
})(() => ({
  position: "relative",
  width: "100dvw",
  height: "100dvh",
  // position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "#171717",
  color: "white",
  fontFamily: "Montserrat",
  fontWeight: "bold",
  padding: "1em",
  // borderRadius: "20px",
  overflow: "hidden",
  zIndex: 1,
  // rowGap: "1em",
  // Ensure meteor layer is positioned correctly
  "& > *": {
    position: "relative",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    // inset: "-3px",
    inset: 0,
    // borderRadius: "10px",
    // background: "radial-gradient(#858585, transparent, transparent)",
    // transform: "translate(-5px, 250px)",
    // transition: "0.4s ease-in-out",
    zIndex: -1,
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    opacity: 1,
    // boxShadow:
    //   "140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff, 110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff, 220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff",
    // boxShadow: createStarfield(
    //   25,
    //   props.theme.custom.sideImage.starColors,
    //   props.theme.custom.sideImage.glowIntensity
    // ), // random stars
    transition: "1.5s ease",
    // animation: `${twinkle} 1s linear alternate infinite`,
    animationDelay: "0.4s",
  },
  // "&:hover::before": {
  //   width: "150%",
  //   height: "100%",
  //   marginLeft: "-4.25em",
  // },
  "&::after": {
    content: '""',
    position: "absolute",
    // inset: "2px",
    inset: 0,
    // borderRadius: "20px",
    // background: "rgba(23,23,23,0.7)",
    // transition: "all 0.4s ease-in-out",
    zIndex: -1,
    /* */
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    opacity: 1,
    // boxShadow:
    //   "490px 330px #fff, 420px 300px #fff, 320px 280px #fff, 380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff, 200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff, 120px 230px #fff, 350px -1px #fff, 150px 369px #fff",
    // boxShadow: createStarfield(
    //   25,
    //   props.theme.custom.sideImage.starColors,
    //   props.theme.custom.sideImage.glowIntensity
    // ), // random stars
    transition: "2s ease",
    // animation: `${twinkle} 1s linear alternate infinite`,
    animationDelay: "0.8s",
  },
}));

const Ambient = styled(Box, {
  name: PREFIX,
  slot: "Ambient",
  overridesResolver: (_props, styles) => styles.ambient,
})(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  // top: 0,
  // bottom: 0,
  // right: 0,
  // background:
  //   "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
  // background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
  background: `transparent url("/static/textures/clouds_repeat.png") repeat`,
  // backgroundSize: "contain",
  backgroundSize: "1000px 1000px" /* Force the 1:1 image size */,
  animation: `${cloudMove} 150s linear infinite`,
  "::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    // background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
    background:
      "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
    backgroundSize: "contain",
    animation: `${moveBackgroundLeft} 500s linear infinite`,
  },
  // "::after": {
  //   content: '""',
  //   position: "absolute",
  //   inset: 0,
  //   background:
  //     "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat",
  //   backgroundSize: "contain",
  //   animation: `${moveBackgroundRight} 100s linear infinite`,
  // },
  // "&.MuiBox-root .stars": {
  //   background: `url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat`,
  //   position: "absolute",
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   display: "block",
  //   // zIndex: 0,
  // },
  // "&.MuiBox-root .twinkling": {
  //   width: "10000px",
  //   height: "100%",
  //   background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png") repeat`,
  //   position: "absolute",
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   zIndex: 2,
  //   animation: `${moveBackgroundRight} 300s linear infinite`,
  // },
  // "&.MuiBox-root .clouds": {
  //   width: "10000px",
  //   height: "100%",
  //   background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
  //   backgroundSize: "contain",
  //   position: "absolute",
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   // zIndex: 3,
  //   animation: `${moveBackground} 150s linear infinite`,
  // },
}));

const Effect = styled(Box, {
  name: PREFIX,
  slot: "Effect",
  overridesResolver: (_props, styles) => styles.effect,
})(() => ({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  zIndex: 0,
  // "& .shooting-star": {
  //   position: "absolute",
  //   // top: "-5vh", // random vertical
  //   // top: "-50%",
  //   // left: "15%",
  //   // left: "100vw", // start off-screen right
  //   // rotate: "315deg",
  //   // width: "5em",
  //   // width: "0.3vw",
  //   // height: `${props.theme.custom.sideImage.starSize}vh`,
  //   // borderRadius: "50%",
  //   // borderRadius: "100%",
  //   // boxShadow:
  //   //   "0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1)",
  //   // background: "linear-gradient(90deg, #fff, transparent)",
  //   // background: "#fff",
  //   // background: "linear-gradient(-45deg, #FFF, rgba(0, 0, 255, 0))",
  //   filter: "drop-shadow(0 0 7px var(--head-color))",
  //   animation: `${shootingStar} var(--glow-duration) linear infinite, ${tail} var(--glow-duration) linear infinite`,
  //   // animation: `${tail} 7s ease-in-out infinite`,
  //   animationFillMode: "backwards",
  //   // animationDirection: "reverse",
  //   willChange: "transform, opacity",
  //   offsetRotate: "auto" /* 👈 aligns with path direction */,
  //   offsetAnchor: "right center",
  //   offsetDistance: "0%",
  //   // transition: "1s ease",
  //   // animationDelay: `${Math.random() * 10}s`,
  //   // "::before": {
  //   //   content: '""',
  //   //   position: "absolute",
  //   //   // top: "-50%",
  //   //   top: `calc(50% - 0.15vh)`,
  //   //   right: 0,
  //   //   // transform: "rotate(180deg) translateX(100%) translateY(-100%)",
  //   //   // width: "10em",
  //   //   height: "0.3vh",
  //   //   // offsetRotate: "auto",
  //   //   // background:
  //   //   //   "linear-gradient(90deg, var(--head-color), transparent)",
  //   //   background:
  //   //     "linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--head-color), rgba(0, 0, 255, 0))",
  //   //   borderRadius: "100%",
  //   //   transform: "translateX(50%) rotateZ(45deg)",
  //   //   animation: `${shining} 5s ease-in-out infinite`,
  //   //   animationFillMode: "backwards",
  //   // },
  //   // "::after": {
  //   //   content: '""',
  //   //   position: "absolute",
  //   //   top: `calc(50% - 0.15vh)`,
  //   //   right: 0,
  //   //   height: "0.3vh",
  //   //   background:
  //   //     "linear-gradient(-45deg, rgba(0, 0, 255, 0), var(--head-color), rgba(0, 0, 255, 0))",
  //   //   borderRadius: "100%",
  //   //   transform: "translateX(50%) rotateZ(-45deg)",
  //   //   animation: `${shining} 5s ease-in-out infinite`,
  //   //   animationFillMode: "backwards",
  //   // },
  // },
  // dynamically inject nth-of-type rules
  // ...useResponsiveShootingStars(
  //   props.theme.custom.sideImage.shootingStarCount,
  //   // props.theme.custom.sideImage.minAngle,
  //   // props.theme.custom.sideImage.maxAngle,
  //   props.theme.custom.sideImage.shootingStarInterval,
  //   props.theme.custom.sideImage.curveFactor,
  //   props.theme.custom.sideImage.trajectoryMix,
  //   props.theme.custom.sideImage.starColors,
  //   props.theme.custom.sideImage.glowIntensity,
  //   props.theme.custom.sideImage.baseSpeed,
  //   props.theme.custom.sideImage.starSize
  // ).reduce((acc, star, i) => {
  //   acc[
  //     `& .${props.theme.custom.sideImage.shootingClass}:nth-of-type(${
  //       i + 1
  //     })`
  //   ] = {
  //     // Test Conent
  //     // height: star.size,
  //     height: star.size,
  //     // width: star.size,
  //     // width: `calc(${star.size} * 1.25)`,
  //     borderRadius: "500% 100% 100% 500%",
  //     // animation: `${shootingStar} ${star.duration} linear infinite, ${tail} ${star.duration} linear infinite, ${twinkle} ${star.delay} linear alternate infinite`,
  //     // borderRadius: "50%",
  //     // top: star.top,
  //     // right: star.right,
  //     // left: "initial",
  //     // left: "100vw", // always start off-screen right
  //     animationDelay: star.delay,
  //     animationDuration: star.duration,
  //     animationFillMode: "forwards",
  //     // "--rot": star.rot, // per-star rotation variable
  //     offsetPath: star.path, // 👈 px-based, regenerated on resize
  //     // background: star.color,
  //     background: `linear-gradient(-45deg, ${star.color}, rgba(0, 0, 255, 0))`,
  //     "--head-color": star.color,
  //     "--trail-path": star.path,
  //     "--glow-duration": star.duration,
  //     span: {
  //       position: "absolute",
  //       zIndex: 3,
  //       boxShadow: star.glow,
  //       // inset: 0,
  //       // right: `calc(${star.size} * 2)`,
  //       // left: 0,
  //       right: `calc(${star.centerPoint} - ${star.halfHead})`,
  //       // right: `calc(50% - ${star.centerPoint})`,
  //       top: `calc(50% - ${star.halfHead})`,
  //       transform: `translateY(calc(-50% + ${star.halfHead}))`,
  //       height: star.head,
  //       width: star.head,
  //       // offsetPath: star.path,
  //       // offsetRotate: "auto",
  //       borderRadius: "50%",
  //       // background: "#FFF",
  //       // border: `0px solid ${star.color}`,
  //       // borderWidth: `1vh`,
  //       // borderColor: `${star.color}`,
  //       //  display: flex;
  //       justifyContent: "center",
  //       alignItems: "center",
  //       background:
  //         "url('/static/images/moon_in_comic_style.svg') no-repeat center center",
  //       // backgroundColor: "#FFFFFF10",
  //       // backgroundBlendMode: "multiply",
  //       backgroundSize: "cover",
  //       animation: `${twinkle} ${star.twinkleDuration} linear alternate infinite, ${infiniteRotate} calc(${star.twinkleDuration} + 0.123) linear infinite`,
  //     },
  //     "::before": {
  //       content: '""',
  //       position: "absolute",
  //       // top: "-50%",
  //       top: `calc(50% - ${star.centerPoint})`,
  //       right: `calc(0% + ${star.centerPoint})`,
  //       // transform: "rotate(180deg) translateX(100%) translateY(-100%)",
  //       // width: "10em",
  //       height: star.size,
  //       // offsetRotate: "auto",
  //       // background:
  //       //   "linear-gradient(90deg, var(--head-color), transparent)",
  //       background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
  //       borderRadius: "100%",
  //       transform: "translateX(50%) rotateZ(45deg)",
  //       // animation: `${shining} 5s ease-in-out infinite`,
  //       animation: `${twinkling(star.baseSize)} ${
  //         star.twinkleDuration
  //       } ease-in-out infinite`,
  //       animationFillMode: "backwards",
  //       // boxShadow: star.glow,
  //       // border: `0px solid ${star.color}`,
  //       // borderWidth: `0 1vh 1vh 1vh`,
  //       // borderColor: "#FFFFFF10",
  //     },
  //     "::after": {
  //       content: '""',
  //       position: "absolute",
  //       top: `calc(50% - ${star.centerPoint})`,
  //       right: `calc(0% + ${star.centerPoint})`,
  //       height: star.size,
  //       background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
  //       borderRadius: "100%",
  //       transform: "translateX(50%) rotateZ(-45deg)",
  //       // animation: `${shining} 5s ease-in-out infinite`,
  //       animation: `${twinkling(star.baseSize)} ${
  //         star.twinkleDuration
  //       } ease-in-out infinite`,
  //       animationFillMode: "backwards",
  //       // boxShadow: star.glow,
  //       // border: `0px solid ${star.color}`,
  //       // borderWidth: `0 1vh 1vh 1vh`,
  //       // borderColor: "#FFFFFF10",
  //     },
  //   };
  //   return acc;
  // }, {} as Record<string, unknown>),
  // ...generateTwinkleStars(
  //   props.theme.custom.sideImage.shootingStarCount,
  //   props.theme.custom.sideImage.starColors,
  //   props.theme.custom.sideImage.starSize
  // ).reduce((acc, star, i) => {
  //   acc[
  //     `& .${props.theme.custom.sideImage.twinkleClass}:nth-of-type(${
  //       i + 1
  //     })`
  //   ] = {
  //     // "--ray": "0.25vh",
  //     // "--core": star.size,
  //     // "--halo": "0.3vh",
  //     // "--blurRay": `calc(${star.size}  * 3.5)`,
  //     position: "absolute",
  //     // left: `calc(${star.left} + ${star.centerPoint})`,
  //     // top: `calc(${star.top} + ${star.centerPoint})`,
  //     left: star.left,
  //     top: star.top,
  //     width: star.size,
  //     height: star.size,
  //     borderRadius: "50%",
  //     boxShadow: star.glow,
  //     animation: `${twinkle} ${star.delay} linear alternate infinite`,
  //     pointerEvents: "none",
  //     background: "#FFF",
  //     zIndex: 3,
  //     "::before": {
  //       content: '""',
  //       position: "absolute",
  //       top: `calc(50% - ${star.centerPoint})`,
  //       right: `calc(0% + ${star.centerPoint})`,
  //       height: star.size,
  //       background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
  //       borderRadius: "100%",
  //       transform: "translateX(50%) rotateZ(45deg)",
  //       animation: `${twinkling(star.baseSize)} ${
  //         star.delay
  //       } ease-in-out infinite`,
  //       // animationDelay: star.delay,
  //     },
  //     "::after": {
  //       content: '""',
  //       position: "absolute",
  //       top: `calc(50% - ${star.centerPoint})`,
  //       right: `calc(0% + ${star.centerPoint})`,
  //       height: star.size,
  //       background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${star.color}, rgba(0, 0, 255, 0))`,
  //       borderRadius: "100%",
  //       transform: "translateX(50%) rotateZ(-45deg)",
  //       animation: `${twinkling(star.baseSize)} ${
  //         star.delay
  //       } ease-in-out infinite`,
  //       // animationDelay: star.delay,
  //     },
  //   };
  //   return acc;
  // }, {} as Record<string, unknown>),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "1px",
    height: "1px",
    borderRadius: "50%",
    opacity: 1,
    inset: 0,
    // boxShadow:
    //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
    // boxShadow: createStarfield(
    //   15,
    //   props.theme.custom.sideImage.starColors,
    //   props.theme.custom.sideImage.glowIntensity
    // ), // random stars
    zIndex: -1,
    transition: "3s ease",
    animation: `${twinkle} 5s linear alternate infinite`,
    // animation: `${twinkle} 1.5s linear alternate infinite`,
    animationDelay: "3s",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    opacity: 1,
    inset: 0,
    // boxShadow:
    //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
    // boxShadow: createStarfield(
    //   15,
    //   props.theme.custom.sideImage.starColors,
    //   props.theme.custom.sideImage.glowIntensity
    // ), // random stars
    zIndex: -1,
    transition: "5.5s ease",
    animation: `${twinkle} 7s linear alternate infinite`,
    // animation: `${twinkle} 1.5s linear alternate infinite`,
    animationDelay: "5s",
  },
}));

const Astronaut = styled(Box, {
  name: PREFIX,
  slot: "Image",
  overridesResolver: (_props, styles) => styles.image,
})(() => ({
  display: "flex",
  position: "absolute",
  width: "5em",
  height: "5em",
  // marginRight: "1em",
  top: "2.5rem",
  left: "2.5rem",
  zIndex: 10,
  img: { animation: `${move} 10s ease-in-out infinite`, zIndex: 10 },
  "&:hover": {
    cursor: "grab",
  },
  "&:active": {
    cursor: "grabbing",
  },
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   width: "1px",
  //   height: "1px",
  //   borderRadius: "50%",
  //   opacity: 1,
  //   inset: 0,
  //   // boxShadow:
  //   //   "220px 118px #fff, 280px 176px #fff, 40px 50px #fff, 60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff, 520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff",
  //   boxShadow: createStarfield(
  //     25,
  //     props.theme.custom.sideImage.starColors,
  //     props.theme.custom.sideImage.glowIntensity
  //   ), // random stars
  //   // zIndex: -1,
  //   transition: "1s ease",
  //   animation: `${glowingStars} 1s linear alternate infinite`,
  //   // animation: `${twinkle} 1.5s linear alternate infinite`,
  //   animationDelay: "0s",
  // },
  "&::after": {
    content: '""',
    position: "fixed",
    top: "-5rem",
    left: "-5rem",
    // top: 0,
    // left: 0,
    width: "10em",
    height: "10em",
    borderRadius: "50%",
    // background: "#f9f9fb",
    backgroundImage: `url('/static/images/full-moon.svg')`,
    // backgroundImage: `url('https://assets.science.nasa.gov/dynamicimage/assets/science/psd/lunar-science/2023/08/colormap_1500.jpg?w=1636&h=500&fit=clip&crop=faces%2Cfocalpoint')`,
    backgroundRepeat: "no-repeat" /* Prevents image tiling */,
    // backgroundPosition: "center" /* Centers the image */,
    backgroundSize: "cover",
    backgroundPosition: "left",
    bottom: 0,
    backgroundColor: "#f9f9fb",
    backgroundBlendMode: "multiply",
    boxShadow:
      "0px 0px 100px rgba(193,119,241,0.8), 0px 0px 100px rgba(135,42,211,0.8), inset #9b40fc 0px 0px 40px -12px",
    transition: "0.5s ease-in-out",
    // transition: "left 0.3s linear",
    // animation: `${moonRotate} 60s linear infinite`,
    zIndex: -1,
  },
  "&:hover::before": {
    filter: "blur(3px)",
  },
  "&:hover::after": {
    boxShadow:
      "0px 0px 200px rgba(193,119,241,1), 0px 0px 200px rgba(135,42,211,1), inset #9b40fc 0px 0px 40px -12px",
  },
}));

const Heading = styled(Typography, {
  name: PREFIX,
  slot: "Heading",
  overridesResolver: (_props, styles) => styles.heading,
})(() => ({}));

// Slot components
const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  // cursor: "url(/static/cursors/yellow.png), auto",
  // [props.theme.breakpoints.up("lg")]: {
  //   // maxWidth: "750px",
  //   maxWidth: "50%",
  // },
  [theme.breakpoints.up("md")]: {
    maxWidth: "min(80%, 750px)",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "max(750px, 50%)",
  },
  "& .MuiFormControl-root": {
    // marginTop: "0.5em",
    // marginBottom: "0",
  },
  // "& .MuiGrid-container": { gap: 0 },
  // zIndex: 1,
}));

const LoginCard = styled(Card, {
  name: PREFIX,
  slot: "Card",
  overridesResolver: (_props, styles) => styles.card,
})(({ theme }) => {
  const alpha8 = theme.alpha(theme.vars.palette.background.default, 0.08);
  const alpha2 = theme.alpha(theme.vars.palette.background.default, 0.02);
  return {
    position: "relative",
    // zIndex: 2,
    overflow: "visible",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    /*** Paper Texture ***/
    backgroundImage: `
            radial-gradient(circle at 1px 1px, ${alpha8} 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, ${alpha2} 2px, ${alpha2} 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, ${alpha2}2px, ${alpha2} 4px)
          `,
    backgroundSize: "8px 8px, 32px 32px, 32px 32px",
    backgroundColor: theme.vars.palette.background.paper,

    /*** Gradient Glow Effect ***/
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // userSelect: "none",
    // animation: `${gradientShift} 10s ease-in-out infinite` /* Faster animation */,

    // "&::before, &::after": {
    //   content: '""',
    //   position: "absolute",
    //   top: "calc(var(--size) / -2)",
    //   left: "calc(var(--size) / -2)",
    //   width: "calc(100% + var(--size))",
    //   height: "calc(100% + var(--size))",
    //   background: `
    //   radial-gradient(circle at 0 0, hsl(27deg 93% 60%), transparent),
    //   radial-gradient(circle at 100% 0, #00a6ff, transparent),
    //   radial-gradient(circle at 0 100%, #ff0056, transparent),
    //   radial-gradient(circle at 100% 100%, #6500ff, transparent)
    // `,
    // },
    // "&::after": {
    //   "--size": "2px",
    //   // zIndex: "-1",
    // },
    // "&::before": {
    //   "--size": "5px",
    //   // zIndex: "-2",
    //   filter: "blur(0.25vmin)",
    //   animation: `${blurAnimation} 3s ease-in-out alternate infinite`,
    // },

    // "&::before, &::after": {
    //   content: '""',
    //   position: "absolute",
    //   left: "-1px",
    //   top: "-1px",
    //   // borderRadius: "5%",
    //   background: `
    //   linear-gradient(
    //     45deg,
    //     hsl(27deg 93% 60%),
    //   #00a6ff,
    //   #ff0056,
    //   #6500ff
    //   )
    // `,

    //   //   // #fb0094,
    //   //   // #0000ff,
    //   //   // #00ff00,
    //   //   // #ffff00,
    //   //   // #ff0000,
    //   //   // #fb0094,
    //   //   // #0000ff,
    //   //   // #00ff00,
    //   //   // #ffff00,
    //   //   // #ff0000

    //   backgroundSize: "250%",
    //   width: "calc(100% + 2px)",
    //   height: "calc(100% + 2px)",
    //   // zIndex: -99,
    //   animation: `${steam} 60s linear infinite`,
    // },
    // "&::after": {
    //   filter: "blur(1vmin)",
    // },
    "& .MuiGrid-container": {
      position: "relative",
      zIndex: 1,
      // background: "linear-gradient(0deg, #000, #272727)",
      // backgroundImage: `
      //   repeating-linear-gradient(45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
      //   repeating-linear-gradient(-45deg, rgba(0, 255, 65, 0.08) 0, rgba(0, 255, 65, 0.08) 1px, transparent 1px, transparent 12px),
      //   repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0, rgba(0, 255, 65, 0.03) 1px, transparent 1px, transparent 4px)
      // `,
      // backgroundSize: "24px 24px, 24px 24px, 8px 8px",

      backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 140, 0, 0.12) 0, rgba(255, 140, 0, 0.12) 1px, transparent 1px, transparent 22px),
            repeating-linear-gradient(-45deg, rgba(255, 69, 0, 0.08) 0, rgba(255, 69, 0, 0.08) 1px, transparent 1px, transparent 22px)
            `,
      backgroundSize: "44px 44px",
    },
    // "& .card-content": {
    "& .MuiCardContent-root": {
      backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
            `,
      // backgroundImage: `
      //   repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
      //   repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
      // `,
      // padding: props.theme.spacing(3),
      // "& .card-box": {
      //   display: "flex",
      //   flexDirection: "column",
      //   gap: 0,
      // },
    },
  };
});

const ThemeToggleWrapper = styled(Box, {
  name: PREFIX,
  slot: "ThemeToggleWrapper",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "1em",
  margin: "-1em -1em -2.5em 0",
}));

export const Auth = (inProps: AuthProps) => {
  // & {
  //   Content?: StyleComponent;
  //   Card?: StyleComponent;
  // },
  const props = useThemeProps({
    props: inProps,
    name: PREFIX,
  });

  const {
    sideImage = defaultSideImage,
    avatarIcon = defaultAvatar,
    children = defaultLoginForm,
    divider = defaultDivider,
    social = defaultSocial,
    authNavigationLinks = defaultAuthNavigationLinks,
    footer = defaultFooter,
    variant = "full",
    src = "/static/images/astronaut.png",
    alt = "Picture of the astronaut",
    // heading = "Find me on Social Media",
    // enableTabs = true, // Enable tabs by default
    // defaultMode = "login",
    enableToggle = true, // Enable toggle by default
    defaultMode = "signin",
    // onSignUp,
    className,
    sx,
    // backgroundImage,
    ...rest
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const { isFetching, data } = useIsAuthenticated();
  const theme = useTheme();
  const router = useRouter();
  // State to track current mode (login or signup)
  const [currentMode, setCurrentMode] = useState<AuthAction>(defaultMode);
  const isLogin = defaultMode === "signin";

  const schema = isLogin ? loginSchema : registerSchema;

  useEffect(() => {
    // already authenticated, redirect to the home page
    if (data) {
      // router.push("/");
      router.push(data.authenticated ? data.redirectTo || "/fts" : "/login");
    }
    // not authenticated, stay on the login page
  }, [router, data]);

  // const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(
      schema,
      // {
      //   async: true, // 🔥 enable async validation
      // }
    ),
    mode: "onChange",
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
  });

  // Toggle between login and signup
  const handleToggle = () => {
    setCurrentMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  // const { control, handleSubmit } = form;

  // const onSubmit = async (values: any) => {
  //   if (isLogin) {
  //     login(values); // 🔥 uses your authProvider automatically
  //   } else {
  //     console.log("register", values);
  //     // call your signup API here
  //     await authService.register(values);
  //     login(values); //
  //   }
  // };

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //     <Stack spacing={2}>
  //       {!isLogin && (
  //         <TextField name="username" control={control} label="Username" />
  //       )}

  //       <TextField name="email" control={control} label="Email" />

  //       <PasswordField
  //         name="password"
  //         control={control}
  //         label="Password"
  //         type="password"
  //       />

  //       {!isLogin && (
  //         <PasswordField
  //           name="confirmPassword"
  //           control={control}
  //           label="Confirm Password"
  //           type="password"
  //         />
  //       )}

  //       <Button type="submit" variant="contained" disabled={isPending}>
  //         {isPending ? "Loading..." : isLogin ? "Login" : "Sign Up"}
  //       </Button>
  //     </Stack>
  //   </form>
  // );

  return (
    <Root
      ref={containerRef}
      variant={variant}
      className={className}
      sx={sx}
      {...rest}
    >
      <Auth.overlay>
        <Auth.ambient />
        <Auth.effect
          shootingStarCount={theme.custom.sideImage.shootingStarMaxCount}
          twinkleStarCount={theme.custom.sideImage.twinkleStarMaxCount}
          // count={theme.custom.sideImage.shootingStarCount}
          // shootingStarClass={theme.custom.sideImage.shootingClass}
          // twinkleClass={theme.custom.sideImage.twinkleClass}
        />
        <Auth.image src={src} alt={alt} />
        {/* <Auth.content> */}
        <Content>
          <Auth.card>
            <Grid container spacing={0}>
              {/* Image section - hidden on mobile */}
              {sideImage}

              {/* Form section */}
              <Grid size={{ xs: 12, md: 6 }}>
                <ParticleHexBackground
                  size={7} // 1rem density hex cells
                  stroke={0.5} // Sleek, ultra-thin grid lines
                  gap={0} // Clear padding gaps
                  speed={90} // Twice as fast color shifting (Default was 64)
                  glowRadius={25} // Extra tight mouse trailing glow bubble
                  gridStrokeColor="rgba(255, 255, 255, 0.0125)" // Translucent line integration
                >
                  <CardContent>
                    <ThemeToggleWrapper>
                      <ThemeToggle />
                    </ThemeToggleWrapper>

                    <Box>
                      {avatarIcon}
                      {/* {children}
                      {divider}
                      {social}
                      {signUp} */}
                      {/* Conditional rendering: Tabs or Traditional */}
                      {/* {enableTabs ? (
                        <AuthTabs
                          loginForm={
                            <>
                              {children}
                            </>
                          }
                          signUpForm={
                            <>
                              <SignUpForm />
                            </>
                          }
                          defaultTab={currentTab}
                          onTabChange={handleTabChange}
                        />
                      ) : (
                        <>{children}</>
                      )} */}

                      {/* Show Login or Signup form based on currentMode */}
                      <Box
                        key={currentMode} // ← This is the magic line! It forces remount and retriggers animation
                        sx={{
                          animation: `${
                            currentMode === "signin" ? fadeIn : fadeOut
                          } 0.75s ease`,
                        }}
                      >
                        {/* {currentMode === "signin" ? (
                        // Login Form
                        <>{children}</>
                      ) : (
                        // Signup Form
                        <>
                          <SignUpForm />
                        </>
                      )} */}
                        <AuthForm mode={currentMode} />
                      </Box>

                      {/* Toggle Link - shown after form */}
                      {enableToggle && (
                        <AuthNavigationLink
                          mode={currentMode}
                          onToggle={handleToggle}
                        />
                      )}
                      {/* {authNavigationLinks} */}
                      {/* Divider and Social Login - shown for both forms */}
                      {divider}
                      {social}
                    </Box>
                  </CardContent>
                </ParticleHexBackground>
              </Grid>
            </Grid>
          </Auth.card>
          {footer}
        </Content>
        {/* <ThemeToggle /> */}
        {/* </Auth.content> */}
        {/* <Login.Heading>{heading}</Login.Heading> */}
        {/* <Auth.icon>
          {Object.entries(PROVIDERS).map(([key, provider]) => (
            <SocialButton
              key={key}
              variant="outlined"
              icon={provider.icon}
            >
            </SocialButton>
          ))}
        </Auth.icon> */}
        {/* <Icons /> */}
      </Auth.overlay>
    </Root>
  );
};

Auth.overlay = Overlay;
Auth.ambient = () => (
  <Ambient>
    {/* <Box className="stars" />
    <Box className="twinkling" />
    <Box className="clouds" /> */}
  </Ambient>
);
Auth.image = ({ src, alt }: { src: string; alt: string }) => (
  <Astronaut>
    <Image
      preload={false}
      loading="lazy"
      src={src}
      alt={alt}
      fill
      style={{ objectFit: "contain" }}
      unoptimized
    />
    <RocketAnimation
      size="10em"
      position="fixed"
      transform="translate(-50%, -50%)"
    />
  </Astronaut>
);
Auth.effect = ({ shootingStarCount, twinkleStarCount }: EffectProps) => {
  const theme = useTheme();

  // 1. Memoize the config objects/arrays from the theme
  const sideImageConfig = useMemo(
    () => theme.custom?.sideImage || {},
    [theme.custom?.sideImage],
  );
  const meteorConfig = useMemo(
    () => theme.custom?.meteor || {},
    [theme.custom?.meteor],
  );

  // 2. Specifically memoize the colors array since it's used in dependencies
  const starColors = useMemo(
    () => sideImageConfig?.starColors || ["#fff"],
    [sideImageConfig?.starColors],
  );

  // Get configurations from theme
  // const meteorConfig = theme.custom?.meteor;
  // const sideImageConfig = theme.custom?.sideImage;

  return (
    <Effect>
      {/* {Array.from({ length: count }).map((_, i) => (
        <span key={v7()} className={shootingStarClass}>
          <span key={i} />
        </span>
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} className={twinkleClass} />
      ))} */}
      {/* Dynamic Shooting Stars */}
      {/* <ShootingStars
        count={sideImageConfig?.shootingStarCount || 20}
        interval={sideImageConfig?.shootingStarInterval || 5}
        curveFactor={sideImageConfig?.curveFactor || 50}
        trajectoryMix={sideImageConfig?.trajectoryMix}
        colors={sideImageConfig?.starColors}
        glowIntensity={sideImageConfig?.glowIntensity}
        baseSpeed={sideImageConfig?.baseSpeed}
        baseSize={sideImageConfig?.starSize}
      /> */}

      {/* Shooting Stars - Now spawns dynamically like meteors */}
      <ShootingStars
        maxCount={shootingStarCount || 5}
        spawnInterval={sideImageConfig?.shootingStarSpawnInterval || 2000}
        curveFactor={sideImageConfig?.curveFactor || 50}
        trajectoryMix={sideImageConfig?.trajectoryMix}
        colors={sideImageConfig?.starColors}
        glowIntensity={sideImageConfig?.glowIntensity || 1.25}
        baseSpeed={sideImageConfig?.baseSpeed || 0.075}
        baseSize={sideImageConfig?.starSize || 0.5}
        enabled={true}
      />

      {/* Dynamic Twinkle Stars */}
      {/* <TwinkleStars
        count={sideImageConfig?.shootingStarCount || 12}
        colors={sideImageConfig?.starColors}
        baseSize={sideImageConfig?.starSize}
      /> */}

      {/* Twinkle Stars - Now spawns dynamically with lifetime */}
      <TwinkleStars
        maxCount={twinkleStarCount || 10}
        spawnInterval={sideImageConfig?.twinkleStarSpawnInterval || 3000}
        minLifetime={sideImageConfig?.twinkleStarMinLifetime || 10000}
        maxLifetime={sideImageConfig?.twinkleStarMaxLifetime || 25000}
        colors={starColors}
        baseSize={sideImageConfig?.starSize || 0.5}
        enabled={true}
      />

      {/* Dynamic Meteor shower */}
      <MeteorShower
        enabled={meteorConfig.enabled}
        interval={meteorConfig.interval}
        configs={meteorConfig.configs}
      />
    </Effect>
  );
};
// Login.heading = Heading;
// Auth.icon = Icons;
// Auth.content = Content;
Auth.card = LoginCard;
// Auth.Avatar = LoginAvatar;

const defaultLoginForm = (
  // <PasswordLogin
  //   forgotPasswordUrl={process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL}
  // />
  <AuthForm
    mode="signin"
    forgotPasswordUrl={process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL}
  />
);
const defaultSideImage = (
  <SideImage src={process.env.NEXT_PUBLIC_PLACEHOLDER} />
);
// const defaultAvatar = <PersonIcon />;
const defaultAvatar = (
  <AvatarHeader
    src={
      process.env.NEXT_PUBLIC_EARTH_IMAGE_URL ||
      // "https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg"
      "https://assets.razeth.com/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg"
      // "https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=Razeth"
    }
    // avatarIcon={<PersonIcon />}
  />
);
const defaultDivider = <Divider />;
const defaultSocial = <SocialLogin />;
const defaultAuthNavigationLinks = <AuthNavigationLink />;
const defaultFooter = <Footer />;

// ✅ Named exports (optional, for tree-shaking)
export {
  // Header as LoginHeader,
  Content as LoginContent,
  LoginCard,
};

export default Auth;
