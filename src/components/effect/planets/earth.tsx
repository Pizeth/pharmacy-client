import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";

const PREFIX = "RazethPlanetEarth";
const Root = styled("div", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "15vmin",
  height: "50vmin",
  // height: "100vh",
}));

// Create a styled wrapper that matches the Sun's shape
const EarthWrapper = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "relative",
  aspectRatio: "1 / 1",
  borderRadius: "50%", // Keeps the shadow circular

  backgroundBlendMode: "multiply",
  height: "85%", // ← Add this: adjust 80–95% (85% fills and leave some space)

  background: "transparent", // REQUIRED for inset shadows
  // Applying your requested complex shadow
  // boxShadow: `
  //   0px 0 0.2vmin RGBA(255, 255, 255, 0.2),
  //   -0.05vmin 0px 0.8vmin #c3f4ff inset,
  //   1.5vmin 0.2vmin 2.5vmin #000 inset,
  //   -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
  //   25vmin 0px 4.4vmin #00000066 inset,
  //   15vmin 0px 3.8vmin #000000aa inset`,
  overflow: "hidden", // Ensures the SVG texture doesn't spill out
  // --- THE FIX ---
  // We create a pseudo-element that sits ON TOP of the SVG
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   inset: 0,
  //   borderRadius: "50%",
  //   // background: "#000",
  //   boxShadow: `
  //     0 0 0.2vmin rgba(255,255,255,0.2),
  //     -0.05vmin 0 0.8vmin #c3f4ff inset,
  //     1.5vmin 0.2vmin 2.5vmin #000 inset,
  //     -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
  //     25vmin 0 4.4vmin #00000066 inset,
  //     15vmin 0 3.8vmin #000000aa inset
  //   `,
  //   // zIndex: 1,
  //   pointerEvents: "none",
  // },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    pointerEvents: "none", // Ensures you can still click/hover the planet underneath
    zIndex: 10, // Must be higher than the SVG's stacking context

    // Move your shadow here:
    // boxShadow: `
    //     0 0 0.2vmin rgba(255,255,255,0.2),
    //     -0.05vmin 0 0.7vmin rgba(195, 244, 255, 0.5) inset,
    //     1.5vmin 0.2vmin 2.5vmin #000 inset,
    //     -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
    //     2.5vmin 0 4.4vmin #00000066 inset,
    //     5.5vmin 0 5.75vmin #000000aa inset
    //   `,
    boxShadow: `
      0px 0 20px RGBA(255, 255, 255, 0.2), 
      -5px 0px 8px #c3f4ff inset,
      15px 2px 25px #000 inset, 
      -24px -2px 34px #c3f4ff99 inset,
      250px 0px 44px #00000066 inset, 
      150px 0px 38px #000000aa inset
      `,
  },

  // "& > svg": {
  //   position: "relative",
  //   zIndex: 2,
  //   width: "100%",
  //   height: "100%",
  // },
}));

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const cloudsMask = `${PREFIX}-clouds-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function Earth() {
  return (
    <Root>
      <EarthWrapper>
        <svg id="earth" viewBox="-0.5 -0.5 101 101" width="100%" height="100%">
          <g transform="rotate(23.5, 50, 50)">
            {/* Base Layers (Water, Ground and Clouds) */}
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="rgba(0, 0, 200, 1)"
              mask={`url(#${waterMask})`}
            />
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="rgba(0, 100, 0, 1)"
              mask={`url(#${groundMask})`}
            />
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="rgba(255, 255, 255, .8)"
              mask={`url(#${cloudsMask})`}
            />

            {/* Atmosphere and Glare */}
            <rect
              x="-5"
              y="-5"
              width="110"
              height="110"
              fill={`url(#${atmosphereGradient})`}
              mask={`url(#${atmosphereMask})`}
            />
            <circle
              cx="75"
              cy="15"
              r="25"
              fill="rgba(255, 255, 255, .6)"
              filter="url(#glare-blur-filter)"
              overflow={"hidden"}
            />
          </g>
          <defs>
            {/* Filters */}
            <Filter id={FISHEYE_ID} />
            <filter
              id="glare-blur-filter"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="10" />
            </filter>
            {/* Jupiter Glow Filter */}
            <filter
              id="earth-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Atmosphere */}
            <linearGradient
              id={atmosphereGradient}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgb(0,127,255)" stopOpacity="1" />
              <stop offset="100%" stopColor="rgb(0,0,255)" stopOpacity=".5" />
            </linearGradient>
            <radialGradient
              id={atmosphereMaskGradient}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="90%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <CircleMask
              id={atmosphereMask}
              x={-5}
              y={-5}
              width={110}
              height={110}
              r={55}
              pattern={`url(#${atmosphereMaskGradient})`}
            />

            {/* Water, Ground and Clouds */}
            <CircleMask id={waterMask} pattern="white" />
            <CircleMask id={groundMask} pattern={`url(#${groundPattern})`} />
            <CircleMask id={cloudsMask} pattern={`url(#${cloudsPattern})`} />
            <Pattern
              id={groundPattern}
              duration={50}
              href="/static/textures/world_map.svg"
            />
            <Pattern
              id={cloudsPattern}
              duration={35}
              href="/static/textures/earth_cloud.png"
            />
          </defs>
        </svg>
      </EarthWrapper>
    </Root>
  );
}

export default Earth;
