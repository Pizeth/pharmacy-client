"use client";
import { useEffect, useRef, useState } from "react";
import { useCheckAuth } from "ra-core";
import { Box, Card, CardContent, Grid, Theme, Typography } from "@mui/material";
import { styled, useTheme, useThemeProps } from "@mui/material/styles";
import PasswordLogin from "./passwordLogin";
import SocialLogin from "./socialLogin";
import SideImage from "./sideImage";
import AvatarHeader from "./avatar";
import { EffectProps, LoginProps } from "@/interfaces/auth.interface";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { RazethDivider as Divider } from "./divider";
import AuthNavigationLink from "./ui/authNavaigation";
import Footer from "./ui/footer";
import Image from "next/image";
import { StyleComponent } from "@/types/classKey";
import SocialButton from "./ui/socialButton";
import { Instagram, Meta, Telegram, YouTube } from "../icons/socialIcons";
// import MCS from "../icons/mcs";
// import { v7 } from "uuid";
import { MeteorShower } from "./effects/meteors";
import ShootingStars from "./effects/shootingStars";
import TwinkleStars from "./effects/twinkleStars";
import RocketAnimation from "./effects/rocket";
import SignUpForm from "./signUpForm";
import { AuthAction } from "@/types/theme";
import {
  cloudMove,
  fadeIn,
  fadeOut,
  move,
  moveBackgroundLeft,
  twinkle,
} from "@/theme/keyframes";

const PREFIX = "RazethLogin";

const Root = styled("div", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<LoginProps>((props: { theme: Theme }) => ({
  // width: "100vw",
  // height: "100vh",
  // minHeight: "100vh",
  // overflow: "hidden",
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center",
  // // padding: props.theme.spacing(2),
  // backgroundColor:
  //   props.theme.palette.mode === "dark"
  //     ? props.theme.palette.grey[900]
  //     : props.theme.palette.grey[100],
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
  // maxWidth: "100%",
  // height: "100%",
  height: "100dvh",
  // maxHeight: "100%",
  // position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // width: "100%",
  // height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "#171717",
  color: "white",
  fontFamily: "Montserrat",
  fontWeight: "bold",
  padding: "1em 2em 1em 1em",
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
    /* */
    // width: "100%",
    // height: "100%",
    /* */
    // inset: "-3px",
    inset: 0,
    // borderRadius: "10px",
    // background: "radial-gradient(#858585, transparent, transparent)",
    // transform: "translate(-5px, 250px)",
    // transition: "0.4s ease-in-out",
    zIndex: -1,
    /* */
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
  background: `transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat`,
  backgroundSize: "contain",
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

const Icons = styled(Box, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
})(() => ({
  // postion: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  // columnGap: "0.5rem",
  zIndex: 1,
  button: {
    border: "none",
    padding: "0.75rem",
    margin: 0,
    minWidth: "1rem",
    borderRadius: "50%",
    // "&:hover": {
    //   transform: "scale(1.25)",
    // },
  },
  "& svg": {
    width: "1rem",
    height: "1rem",
    transition: "0.3s ease-in-out",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    "&:hover": {
      transform: "scale(1.5)",
    },
    borderRadius: "50%",
  },
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   width: "3px",
  //   height: "3px",
  //   borderRadius: "50%",
  //   opacity: 1,
  //   // boxShadow:
  //   //   "140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff, 110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff, 220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff",
  //   boxShadow: createStarfield(75), // random stars
  //   zIndex: -1,
  //   transition: "1.5s ease",
  //   animation: `${glowingStars} 1s linear alternate infinite`,
  //   animationDelay: "0.4s",
  // },
  // "&::after": {
  //   content: '""',
  //   position: "absolute",
  //   width: "3px",
  //   height: "3px",
  //   borderRadius: "50%",
  //   opacity: 1,
  //   // boxShadow:
  //   //   "490px 330px #fff, 420px 300px #fff, 320px 280px #fff, 380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff, 200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff, 120px 230px #fff, 350px -1px #fff, 150px 369px #fff",
  //   boxShadow: createStarfield(75), // random stars
  //   zIndex: -1,
  //   transition: "2s ease",
  //   animation: `${glowingStars} 1s linear alternate infinite`,
  //   animationDelay: "0.8s",
  // },
  // Specific provider color classes
  "& .web": {
    backgroundColor: "#ffffffff",
  },
  // "& .meta::before": {
  //   content: '""',
  //   position: "absolute",
  //   zIndex: -1,
  //   // top: "10%",
  //   // left: "90%",
  //   top: "10vh" /* 10% of viewport height */,
  //   left: "100vw" /* start just outside right edge */,
  //   rotate: "-45deg",
  //   width: "5em",
  //   height: "1px",
  //   background: "linear-gradient(90deg, #fff, transparent)",
  //   animation: `${shootingStar} 4s ease-in-out infinite`,
  //   transition: "1s ease",
  //   animationDelay: "1s",
  // },
  "& .meta": {
    // backgroundColor: "#0081FB",
  },
  "& .instagram": {
    background: "linear-gradient(45deg,#fd5,#ff543e,#c837ab,#3771c8)",
  },
  "& .telegram": {
    backgroundColor: "#229ed9",
  },
  "& .youtube": {
    backgroundColor: "#FF0000",
  },
  // // Provider-specific hover strokes
  // "& .web svg path": { stroke: "#2859c5" },
  // "& .meta svg path": { stroke: "#0081FB" },
  // "& .instagram svg path": { stroke: "#808080" },
  // "& .instagram:hover svg path": { stroke: "#cc39a4" },
  // "& .telegram svg path": { stroke: "#229ed9" },
  // "& .youtube svg path": { stroke: "#FF0000" },
  // // Scale effects
  // "& .instagram:hover svg": { transform: "scale(1.4)" },
  // "& .telegram:hover svg, & .youtube:hover svg": {
  //   transform: "scale(1.25)",
  // },
}));

// Slot components
const Content = styled(Box, {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})((props: { theme: Theme }) => ({
  width: "100%",
  maxWidth: "100%",
  // [props.theme.breakpoints.up("lg")]: {
  //   // maxWidth: "750px",
  //   maxWidth: "50%",
  // },
  [props.theme.breakpoints.up("md")]: {
    maxWidth: "min(80%, 750px)",
  },
  [props.theme.breakpoints.up("lg")]: {
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
})((props: { theme: Theme }) => ({
  position: "relative",
  // zIndex: 2,
  overflow: "visible",
  borderRadius: props.theme.spacing(2),
  boxShadow: props.theme.shadows[3],
  /*** Paper Texture ***/
  backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
          `,
  backgroundSize: "8px 8px, 32px 32px, 32px 32px",
  backgroundColor: props.theme.palette.background.paper,

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
}));

// Provider configuration
const PROVIDERS = {
  // web: {
  //   name: "Web",
  //   icon: <MCS />,
  //   className: "web",
  // },
  meta: {
    name: "Meta",
    icon: <Meta />,
    className: "meta",
  },
  instagram: {
    name: "Instagram",
    icon: <Instagram />,
    className: "instagram",
  },
  telegram: {
    name: "Telegram",
    icon: <Telegram />,
    className: "telegram",
  },
  youtube: {
    name: "Youtube",
    icon: <YouTube />,
    className: "youtube",
  },
};

// const LoginAvatar = styled(Box, {
//   name: PREFIX,
//   slot: "Avatar",
//   overridesResolver: (_props, styles) => styles.avatar,
// })(() => ({}));

// Main component + slot API
export const Login = (
  inProps: LoginProps & {
    Content?: StyleComponent;
    Card?: StyleComponent;
  },
) => {
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
  const checkAuth = useCheckAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  // const [currentTab, setCurrentTab] = useState<"login" | "signup">(defaultTab);
  // State to track current mode (login or signup)
  const [currentMode, setCurrentMode] = useState<AuthAction>(defaultMode);

  useEffect(() => {
    checkAuth({}, false)
      .then(() => {
        // already authenticated, redirect to the home page
        navigate("/");
      })
      .catch(() => {
        // not authenticated, stay on the login page
      });
  }, [checkAuth, navigate]);

  // const handleTabChange = (tab: AuthAction) => {
  //   setCurrentTab(tab);
  // };

  // Toggle between login and signup
  const handleToggle = () => {
    setCurrentMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  console.log("Login Component Rendered. Current Mode:", currentMode);
  console.log("Theme info", theme.custom);

  return (
    <Root
      ref={containerRef}
      variant={variant}
      className={className}
      sx={sx}
      {...rest}
    >
      <Login.overlay>
        <Login.ambient />
        <Login.effect
          shootingStarCount={theme.custom.sideImage.shootingStarMaxCount}
          twinkleStarCount={theme.custom.sideImage.twinkleStarMaxCount}
          // count={theme.custom.sideImage.shootingStarCount}
          // shootingStarClass={theme.custom.sideImage.shootingClass}
          // twinkleClass={theme.custom.sideImage.twinkleClass}
        />
        <Login.image src={src} alt={alt} />
        <Login.content>
          <Login.card>
            <Grid container spacing={0}>
              {/* Image section - hidden on mobile */}
              {sideImage}

              {/* Form section */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CardContent>
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
                      {currentMode === "signin" ? (
                        // Login Form
                        <>{children}</>
                      ) : (
                        // Signup Form
                        <>
                          <SignUpForm />
                        </>
                      )}
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
              </Grid>
            </Grid>
          </Login.card>
          {footer}
        </Login.content>
        {/* <Login.Heading>{heading}</Login.Heading> */}
        <Login.icon>
          {Object.entries(PROVIDERS).map(([key, provider]) => (
            <SocialButton
              key={key}
              variant="outlined"
              icon={provider.icon}
              // className={provider.className}
            >
              {/* {provider.name} */}
            </SocialButton>
          ))}
        </Login.icon>
      </Login.overlay>
    </Root>
  );
};

Login.overlay = Overlay;
Login.ambient = () => (
  <Ambient>
    {/* <Box className="stars" />
    <Box className="twinkling" />
    <Box className="clouds" /> */}
  </Ambient>
);
Login.image = ({ src, alt }: { src: string; alt: string }) => (
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
Login.effect = ({ shootingStarCount, twinkleStarCount }: EffectProps) => {
  const theme = useTheme();
  // Get configurations from theme
  const meteorConfig = theme.custom?.meteor;
  const sideImageConfig = theme.custom?.sideImage;

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
        colors={sideImageConfig?.starColors}
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
Login.icon = Icons;
Login.content = Content;
Login.card = LoginCard;
// Login.Avatar = LoginAvatar;

const defaultLoginForm = (
  <PasswordLogin
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
      "https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg"
      // "https://api.dicebear.com/9.x/adventurer-neutral/svg?radius=50&seed=Razeth"
    }
    avatarIcon={<PersonIcon />}
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

export default Login;

// export default function LoginPage() {
//   return (
//     <Login Content={Content} Card={LoginCard}>
//       <Login.Content>
//         <Login.Card>
//           <Grid container spacing={0}>
//             {/* Image section - hidden on mobile */}
//             {defaultSideImage}

//             {/* Form section */}
//             <Grid size={{ xs: 12, md: 6 }}>
//               <CardContent>
//                 <Box>
//                   {defaultAvatar}
//                   {defaultLoginForm}
//                   {defaultDivider}
//                   {SocialLogin}
//                   {defaultSignUp}
//                 </Box>
//               </CardContent>
//             </Grid>
//           </Grid>
//         </Login.Card>
//         {defaultFooter}
//       </Login.Content>
//     </Login>
//   );
// }

// const LoginOld = (inProps: LoginProps) => {
//   const props = useThemeProps({
//     props: inProps,
//     name: PREFIX,
//   });
//   const {
//     avatarIcon = defaultAvatar,
//     children = defaultLoginForm,
//     divider = defaultDivider,
//     signUp = defaultSignUp,
//     footer = defaultFooter,
//     variant = "full",
//     className,
//     sx,
//     // backgroundImage,
//     // avatarIcon = defaultAvatar,
//     ...rest
//   } = props;
//   const containerRef = useRef<HTMLDivElement>(null);
//   const checkAuth = useCheckAuth();
//   // const theme = useTheme();
//   const navigate = useNavigate();
//   useEffect(() => {
//     checkAuth({}, false)
//       .then(() => {
//         // already authenticated, redirect to the home page
//         navigate("/");
//       })
//       .catch(() => {
//         // not authenticated, stay on the login page
//       });
//   }, [checkAuth, navigate]);

//   return (
//     <Root
//       ref={containerRef}
//       variant={variant}
//       className={className}
//       sx={sx}
//       {...rest}
//       // sx={{
//       //   minHeight: "100vh",
//       //   display: "flex",
//       //   alignItems: "center",
//       //   justifyContent: "center",
//       //   p: 2,
//       //   backgroundColor:
//       //     theme.palette.mode === "dark"
//       //       ? theme.palette.grey[900]
//       //       : theme.palette.grey[100],
//       // }}
//     >
//       <Box
//         className={LoginClasses.content}
//         // sx={{ width: "100%", maxWidth: { xs: "100%", md: "750px" } }}
//       >
//         <Card
//           className={LoginClasses.card}
//           // sx={{ overflow: "hidden", borderRadius: 2, boxShadow: 3 }}
//         >
//           <Grid container>
//             {/* Image section - hidden on mobile */}
//             <SideImage src="static/images/placeholder-mcs-orange.svg" />

//             {/* Form section */}
//             <Grid size={{ xs: 12, md: 6 }}>
//               <CardContent
//                 className="card-content"
//                 // sx={{ p: { xs: 3, md: 4 } }}
//               >
//                 <Box
//                   className="card-box"
//                   // sx={{ display: "flex", flexDirection: "column", gap: 0 }}
//                 >
//                   {avatarIcon}
//                   {children}
//                   {/* <Box
//                     sx={{
//                       position: "relative",
//                       display: "flex",
//                       alignItems: "center",
//                       my: 2,
//                     }}
//                   >
//                     <Divider sx={{ flex: 1 }} />
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         px: 2,
//                         backgroundColor: theme.palette.background.paper,
//                         color: "text.secondary",
//                       }}
//                     >
//                       Or continue with
//                     </Typography>
//                     <Divider sx={{ flex: 1 }} />
//                   </Box> */}
//                   {divider}
//                   {SocialLogin}

//                   {/* <Box
//                     sx={{
//                       textAlign: "center",
//                       mt: 1,
//                       color: "text.secondary",
//                     }}
//                   >
//                     Don&apos;t have an account?{" "}
//                     <Link
//                       href="#"
//                       sx={{
//                         color: "primary.main",
//                         textDecoration: "underline",
//                         textUnderlineOffset: "2px",
//                         "&:hover": {
//                           textDecoration: "underline",
//                         },
//                       }}
//                     >
//                       Sign up
//                     </Link>
//                   </Box> */}
//                   {signUp}
//                 </Box>
//               </CardContent>
//             </Grid>
//           </Grid>
//         </Card>

//         {/* <Box
//           sx={{
//             mt: 2,
//             textAlign: "center",
//             color: "text.secondary",
//             fontSize: "0.75rem",
//             a: {
//               color: "primary.main",
//               textDecoration: "underline",
//               textUnderlineOffset: "2px",
//               "&:hover": {
//                 textDecoration: "underline",
//               },
//             },
//           }}
//         >
//           By clicking continue, you agree to our{" "}
//           <Link href="#">Terms of Service</Link> and{" "}
//           <Link href="#">Privacy Policy</Link>.
//         </Box> */}
//         {footer}
//       </Box>
//     </Root>
//   );
// };

// export const LoginClasses = {
//   root: `${PREFIX}-root`,
//   content: `${PREFIX}-content`,
//   button: `${PREFIX}-button`,
//   icon: `${PREFIX}-icon`,
//   card: `${PREFIX}-card`,
//   avatar: `${PREFIX}-avatar`,
// };

// export const LoginStyles = (theme: Theme) => ({
//   [` .${LoginClasses.root}`]: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: theme.spacing(2),
//     backgroundColor:
//       theme.palette.mode === "dark"
//         ? theme.palette.grey[900]
//         : theme.palette.grey[100],
//   },
//   [`& .${LoginClasses.content}`]: {
//     width: "100%",
//     maxWidth: "100%",
//     [theme.breakpoints.up("md")]: {
//       maxWidth: "750px",
//     },
//     // maxWidth: { xs: "100%", md: "750px" },
//     [`& .${LoginClasses.card}`]: {
//       overflow: "hidden",
//       borderRadius: theme.spacing(2),
//       boxShadow: theme.shadows[3],
//       ["& .card-content"]: {
//         padding: theme.spacing(3, 4),
//         ["& .card-box"]: {
//           display: "flex",
//           flexDirection: "column",
//           gap: 0,
//         },
//       },
//     },
//   },
//   [`& .${LoginClasses.avatar}`]: {
//     margin: theme.spacing(0, 0, 1.5, 0),
//     display: "flex",
//     justifyContent: "center",
//     ["& .MuiAvatar-root"]: { backgroundColor: "#e72d32" },
//     "& svg": {
//       fill: "#fff",
//     },
//   },
//   // [`& .MuiBox-root`]: {
//   //   gap: theme.spacing(0),
//   // },
//   // [`& .${LoginClasses.content}`]: {
//   //   minWidth: 300,
//   //   padding: `${theme.spacing(0)}`,
//   // },
//   // [`& .${LoginClasses.button}`]: {
//   //   // marginTop: theme.spacing(2),
//   //   mt: 1,
//   //   py: 1.5,
//   //   fontWeight: 600,
//   // },
//   // [`& .${LoginClasses.icon}`]: {
//   //   margin: theme.spacing(0.3),
//   // },
// });

// const Root = styled("div", {
//   name: PREFIX,
//   slot: "Root",
//   overridesResolver: (_props, styles) => styles.root,
// })<LoginProps>(({ theme }) => LoginStyles(theme));

// Root styled component
