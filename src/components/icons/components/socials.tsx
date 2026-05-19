import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import { MCS } from "../mcs";
import { Instagram, Meta, Telegram, YouTube } from "../socialIcons";
import { SocialButton } from "./socialButton";

const PREFIX = "RazethSocialIcons";

// Provider configuration
const PROVIDERS = {
  web: {
    name: "Web",
    icon: <MCS />,
    className: "web",
  },
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

const Root = styled(Box, {
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

const Icons = () => {
  return (
    <Root>
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
    </Root>
  );
};

export default Icons;
