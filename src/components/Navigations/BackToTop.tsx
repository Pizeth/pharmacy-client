import { Fab, useScrollTrigger, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState } from "react";

const BackToTopButton = styled(Fab, { name: "RazethBackToTop", slot: "Root", overridesResolver: (_props, styles) => styles.root })({
  position: "fixed",
  bottom: "2.5vmin",
  right: "2.5vmin",
  boxShadow: "5px 5px 12px rgb(0 0 0 / 35%), -4px -4px 10px rgb(255 255 255 / 22%), inset 1px 1px 2px rgb(255 255 255 / 25%)",
  "&:hover": {
    boxShadow: "7px 7px 16px rgb(0 0 0 / 40%), -5px -5px 12px rgb(255 255 255 / 25%), inset 1px 1px 2px rgb(255 255 255 / 30%)",
  },
  "&:active": {
    boxShadow: "inset 3px 3px 7px rgb(0 0 0 / 30%), inset -3px -3px 7px rgb(255 255 255 / 22%)",
  },
  "& img": { objectFit: "contain" },
});

function BackToTopFab() {
  // threshold: 100 means the trigger becomes true after scrolling 100px
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  const [isScrolling, setIsScrolling] = useState(false);

  const handleClick = () => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset icon after reaching the top (roughly after animation ends)
    setTimeout(() => setIsScrolling(false), 1500);
  };

  return (
    <Zoom in={trigger} aria-label="scroll back to top">
      <BackToTopButton
        color="primary"
        size="small"
        onClick={handleClick}
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
