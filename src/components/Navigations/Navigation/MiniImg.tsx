import { styled, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";

const PREFIX = "RazethMiniImg";
const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  flexGrow: 1,
  // display: { xs: "flex", sm: "block" },
  // mr: 1,
  // position: "relative",
  // width: `max(40px, 7vmin)`,
  // height: `max(40px, 7vmin)`,
  top: 0,
  left: 0,
  // width: "100%",
  // height: "100%",
  // inset: 0,
  [theme.breakpoints.up("xs")]: {
    display: "flex",
  },
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
  img: {
    p: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "0.75s",
    pointerEvents: "none",
    zIndex: 3,
  },
}));

const MiniImg = ({ src = "/static/images/logo.svg" }) => {
  return (
    <Root>
      <Image
        src={src}
        alt="Logo"
        preload={false}
        loading="eager"
        fill
        style={{ objectFit: "contain" }}
        unoptimized
      />
    </Root>
  );
};

export default MiniImg;

{
  /* <Box
        sx={{
          position: "relative",
          zIndex: 2,

          aspectRatio: "1 / 1",

          height: "fill-available",
          overflow: "visible",
          inset: 0,
          objectFit: "cover",
        }}
      >
        <Image
          //   src="/static/images/logo.svg"
          src={src}
          alt="Logo"
          preload={false}
          loading="eager"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
        <Box
          sx={{
            position: "absolute",
            top: (theme) =>
              `calc(100% + ${theme.custom.sideImage.captionOffset.xs})`,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            // 👇 key changes
            whiteSpace: "nowrap", // prevent wrapping
            overflow: "visible", // allow text to extend beyond logo box
            maxWidth: "none", // remove inherited width limit
            color: "#edad54",
            textAlign: "center",
            fontSize: (theme) => theme.custom.sideImage.captionFontSize.xs,
            textShadow: (theme) => `
                                  -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                                  0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                                  -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                                  0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
                                  0    0   7px ${theme.custom.sideImage.captionGlowColor}
                                `,
            WebkitTextStroke: (theme) =>
              `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
          }}
        >
          <Typography variant="h6">ក្រសួងមុខងារសាធារណៈ</Typography>
        </Box>
      </Box> */
}

{
  /* <Box
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
</Box> */
}
