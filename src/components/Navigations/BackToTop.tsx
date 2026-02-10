import { Fab, useScrollTrigger, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useState } from "react";

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
    setTimeout(() => setIsScrolling(false), 1000);
  };

  return (
    <Zoom in={trigger} aria-label="scroll back to top">
      <Fab
        color="primary"
        size="small"
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: "10vmin",
          right: "2.5vmin",
          img: { objectFit: "contain" },
        }}
      >
        {isScrolling ? (
          <img src="/static/images/shoryuken.gif" alt="Scrolling..." />
        ) : (
          <ArrowUpwardIcon />
        )}
      </Fab>
    </Zoom>
  );
}

export default BackToTopFab;
