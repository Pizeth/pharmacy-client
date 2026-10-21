"use client";

import { Fab, useScrollTrigger, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useScrollToTop } from "./useScrollToTop";
import { HEADER_GOLD_GRADIENT } from "./styles/constants";

const BackToTopButton = styled(Fab, { name: "RazethBackToTop", slot: "Root", overridesResolver: (_props, styles) => styles.root })({
  position: "fixed",
  bottom: "2.5vmin",
  right: "2.5vmin",
  color: "#F0C54C",
  border: "2px solid transparent",
  backgroundColor: "#26247B",
  backgroundImage: `linear-gradient(#26247B, #26247B), ${HEADER_GOLD_GRADIENT}`,
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
  boxShadow: "5px 5px 12px rgb(0 0 0 / 35%), -4px -4px 10px rgb(255 255 255 / 22%), inset 1px 1px 2px rgb(255 255 255 / 25%)",
  "&:hover": {
    backgroundColor: "#26247B",
    backgroundImage: `linear-gradient(145deg, #33318f, #26247B), ${HEADER_GOLD_GRADIENT}`,
    boxShadow: "7px 7px 16px rgb(0 0 0 / 40%), -5px -5px 12px rgb(255 255 255 / 25%), inset 1px 1px 2px rgb(255 255 255 / 30%)",
  },
  "&:active": {
    boxShadow: "inset 3px 3px 7px rgb(0 0 0 / 30%), inset -3px -3px 7px rgb(255 255 255 / 22%)",
  },
  "&.Mui-focusVisible": { outline: "2px solid #F0C54C", outlineOffset: 3 },
  "& img": { objectFit: "contain", width: "100%", height: "100%" },
});

function BackToTopFab() {
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const { isScrolling, scrollToTop } = useScrollToTop();

  return (
    <Zoom in={trigger || isScrolling}>
      <BackToTopButton
        size="small"
        onClick={scrollToTop}
        aria-label="scroll back to top"
        aria-busy={isScrolling}
      >
        {isScrolling ? (
          <img src="/static/images/shoryuken.gif" alt="Scrolling..." />
        ) : (
          <ArrowUpwardIcon />
        )}
      </BackToTopButton>
    </Zoom>
  );
}

export default BackToTopFab;
