import {
  Avatar,
  Box,
  styled,
  Theme,
  Typography,
  useThemeProps,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import { AvatarProps } from "@/interfaces/auth.interface";
import { useTranslate } from "ra-core";
import RocketAnimation from "./effects/rocket";
import { earthRotate } from "@/theme/keyframes";
import { buildResponsiveShadow } from "@/utils/themeUtils";

const AvatarHeader = (inProps: AvatarProps) => {
  const props = useThemeProps({
    props: inProps,
    name: inProps.prefix || PREFIX,
  });
  const {
    avatarIcon = defaultAvatarIcon,
    // src,
    className,
    sx,
    title,
    ...rest
  } = props;
  const translate = useTranslate();

  return (
    <BoxAvatar className={className} sx={sx} {...rest}>
      {/* <Box sx={{ display: "flex", position: "relative" }}>
        <RocketAnimation />
        <Avatar alt="Razeth">{avatarIcon}</Avatar>
      </Box> */}

      <Avatar alt="Razeth">{avatarIcon}</Avatar>
      <Typography align="center" variant="h6" fontWeight="bold" gutterBottom>
        {translate("razeth.title.welcome") || title}
      </Typography>
      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: "300px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        Login to your MCS account
      </Typography> */}
    </BoxAvatar>
  );
};

const defaultAvatarIcon = <PersonIcon />;
const PREFIX = "RazethAvatar";

const BoxAvatar = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AvatarProps>((props: { theme: Theme }) => ({
  margin: props.theme.spacing(0, 0, 0, 0),
  // display: "flex",
  // justifyContent: "center",
  display: "flex", // Use flexbox for alignment
  flexDirection: "column", // Arrange items vertically
  alignItems: "center", // Center items horizontally
  "& .MuiAvatar-root": {
    "--avatar-size": "min(12vmin, 70px)", // responsive size
    width: "var(--avatar-size)",
    height: "var(--avatar-size)",

    // marginBottom: props.theme.spacing(1),
    backgroundImage: `url('https://pub-ce3376330760464f8be1e4a3b46318c0.r2.dev/sea-planet-water-Earth-map-Arctic-193611-wallhere.com.jpg')`,
    // backgroundColor: "#e72d32",
    // background: "linear-gradient(135deg, #1e1e24 10%, #050505 60%)",
    color: props.theme.palette.primary.main,
    position: "relative",

    /*** Globe Animation ***/
    zIndex: 5,
    transition: "left 0.5s linear",
    backgroundSize: "cover",
    backgroundPosition: "left",
    bottom: 0,
    borderRadius: "50%",
    animation: `${earthRotate} 90s linear infinite`,
    // boxShadow: `
    //   0px 0 20px rgba(255, 255, 255, 0.2),
    //   -5px 0px 8px #c3f4ff inset,
    //   15px 2px 25px #000 inset,
    //   -24px -2px 34px #c3f4ff99 inset,
    //   250px 0px 44px #00000066 inset,
    //   150px 0px 38px #000000aa inset
    // `,
    // boxShadow: `0px 0 3px rgba(255,255,255,0.2),
    //   -1px 0px 1px #c3f4ff inset,
    //   2px 0px 4px #000 inset,
    //   -4px 0px 5px #c3f4ff99 inset,
    //   40px 0px 7px #00000066 inset,
    //   24px 0px 6px #000000aa inset;`,
    boxShadow: buildResponsiveShadow(),
    //   "&::before": {
    //     content: '""',
    //     position: "absolute",
    //     inset: 0,
    //     borderRadius: "50%",
    //     background: `
    //   radial-gradient(circle at 0 0, hsl(27deg 93% 60%), transparent),
    //   radial-gradient(circle at 100% 0, #00a6ff, transparent),
    //   radial-gradient(circle at 0 100%, #ff0056, transparent),
    //   radial-gradient(circle at 100% 100%, #6500ff, transparent)
    // `,
    //     // zIndex: -1,
    //     filter: "blur(100vmin)",
    //     animation: `${blurPulse} 3s ease-in-out alternate infinite`,
    //   },
  },
  "& svg": { fill: "#fff" },
  "& .MuiTypography-root": {
    marginBottom: props.theme.spacing(0),
    // fontWeight: 900,
    color: props.theme.palette.text.primary,
  },
}));

// export const AvatarStyles = () => ({
//   //   textAlign: "center",
//   [`& .${AvatarClasses.avatar}`]: {
//     margin: "1em",
//     display: "flex",
//     justifyContent: "center",
//   },
// });

// const StyledAvatar = styled(Box, {
//   name: PREFIX,
//   overridesResolver: (_props, styles) => styles.root,
// })(AvatarStyles);

export default AvatarHeader;
