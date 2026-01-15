import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";

const PREFIX = "RazethPlanetJupiter";
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
  // backgroundColor: "rgb(33 33 33)", // Dark background to see the glow
}));

// 1. Create a styled wrapper that matches the Sun's shape
const JupiterWrapper = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "relative",
  aspectRatio: "1 / 1",
  borderRadius: "50%", // Keeps the shadow circular

  // backgroundBlendMode: "multiply",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)", // center it
  // width: "inherit", // ← Add this: adjust 80–95vmin to taste (85vmin fills most screens nicely)
  height: "85%", // ← Add this: same as width for perfect circle

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
    boxShadow: `
      0px 0 20px RGBA(255, 255, 255, 0.2), -5px 0px 8px rgb(255, 253, 231, 0.55) inset,
    15px 2px 25px #4B3621 inset, -24px -2px 34px #E2725B99 inset,
    250px 0px 44px #2F3E4666 inset, 150px 0px 38px #5D4037aa inset`,
  },

  // "& > svg": {
  //   position: "relative",
  //   zIndex: 2,
  //   width: "100%",
  //   height: "100%",
  // },
}));

const cloudsMask = `${PREFIX}-clouds-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function Jupiter() {
  return (
    <Root>
      <JupiterWrapper>
        <svg
          id="jupiter"
          viewBox="-0.5 -0.5 101 101"
          width="100%" // ← Change to 100%
          height="100%"
        >
          <g transform="rotate(3.2, 50, 50)">
            {/* The Core Jupiter Circle */}
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${groundPattern})`}
              filter="url(#jupiter-glow)"
            />

            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill={"RGBA(118,118,118, 0.35)"}
              mask={`url(#${cloudsMask})`}
            />

            {/* Atmosphere and Glare */}
            {/* <rect
              x="-5"
              y="-5"
              width="110"
              height="110"
              fill={`url(#${atmosphereGradient})`}
              mask={`url(#${atmosphereMask})`}
            /> */}

            {/* Atmosphere and Glare */}
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${atmosphereGradient})`}
              mask={`url(#${atmosphereMask})`}
              pointerEvents="none"
            />

            <circle
              cx="75"
              cy="25"
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
              id="jupiter-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <CircleMask id={cloudsMask} pattern={`url(#${cloudsPattern})`} />
            {/* Radial Gradient for depth/heat */}
            {/* <radialGradient id={atmosphereGradient}>
            <stop offset="0.5%" stopColor="rgb(194, 103, 20, 0.05)" />
            <stop offset="7%" stopColor="rgb(167, 142, 113, 0.1)" />
            <stop offset="13.5%" stopColor="rgb(172, 128, 109, 0.15)" />
            <stop offset="29.5%" stopColor="rgb(198, 157, 94, 0.2)" />
            <stop offset="36%" stopColor="rgb(148, 102, 76, 0.25)" />
            <stop offset="41.5%" stopColor="rgb(177, 135, 110, 0.3)" />
            <stop offset="48%" stopColor="rgb(212, 195, 165, 0.35)" />
            <stop offset="54.5%" stopColor="rgb(188, 155, 114, 0.4)" />
            <stop offset="61%" stopColor="rgb(216, 213, 196, 0.45)" />
            <stop offset="67.5%" stopColor="rgb(183, 165, 125, 0.5)" />
            <stop offset="74" stopColor="rgb(167, 152, 111, 0.55)" />
            <stop offset="80.5%" stopColor="rgb(141, 127, 92, 0.6)" />
            <stop offset="87%" stopColor="rgb(173, 159, 122, 0.65)" />
            <stop offset="93.5%" stopColor="rgb(215, 189, 140, 0.7)" />
            <stop offset="100%" stopColor="rgb(255, 208, 142, 0.75)" />
          </radialGradient> */}
            <CircleMask
              id={atmosphereMask}
              x={-5}
              y={-5}
              width={110}
              height={110}
              r={55}
              pattern={`url(#${atmosphereMaskGradient})`}
            />
            <radialGradient
              id={atmosphereMaskGradient}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="70%" stopColor="white" stopOpacity="0" />
              <stop offset="90%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Atmosphere */}
            <linearGradient
              id={atmosphereGradient}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgb(248, 199, 117)" />
              <stop offset="5%" stopColor="rgb(184, 160, 107)" />
              <stop offset="10%" stopColor="rgb(164, 136, 83)" />
              <stop offset="15%" stopColor="rgb(189, 163, 114)" />
              <stop offset="20%" stopColor="rgb(156, 124, 82)" />
              <stop offset="25%" stopColor="rgb(229, 226, 195)" />
              <stop offset="30%" stopColor="rgb(189, 150, 96)" />
              <stop offset="35%" stopColor="rgb(200, 220, 226)" />
              <stop offset="40%" stopColor="rgb(123, 48, 0)" />
              <stop offset="45%" stopColor="rgb(223, 174, 100)" />
              <stop offset="55%" stopColor="rgb(221, 199, 109)" />
              <stop offset="60%" stopColor="rgb(203, 167, 96)" />
              <stop offset="65%" stopColor="rgb(208, 146, 83)" />
              <stop offset="70%" stopColor="rgb(233, 249, 254)" />
              <stop offset="75%" stopColor="rgb(214, 197, 151)" />
              <stop offset="80%" stopColor="rgb(183, 151, 115)" />
              <stop offset="85%" stopColor="rgb(183, 175, 160)" />
              <stop offset="90%" stopColor="rgb(206, 204, 169)" />
              <stop offset="95%" stopColor="rgb(165, 147, 90)" />
              <stop offset="100%" stopColor="rgb(181, 160, 117)" />
              {/* <stop offset="73.5%" stopColor="rgb(212, 195, 165, 0.35)" />
            <stop offset="76.9%" stopColor="rgb(188, 155, 114, 0.4)" />
            <stop offset="80.3%" stopColor="rgb(216, 213, 196, 0.45)" />
            <stop offset="83.7%" stopColor="rgb(183, 165, 125, 0.5)" />
            <stop offset="87.1%" stopColor="rgb(167, 152, 111, 0.55)" />
            <stop offset="90.5%" stopColor="rgb(141, 127, 92, 0.6)" />
            <stop offset="93.9%" stopColor="rgb(173, 159, 122, 0.65)" />
            <stop offset="97.3%" stopColor="rgb(215, 189, 140, 0.7)" />
            <stop offset="100%" stopColor="rgb(255, 208, 142, 0.75)" /> */}
            </linearGradient>

            {/* Scrolling Jupiter Surface Pattern */}
            <Pattern
              id={groundPattern}
              duration={70}
              width={225.45}
              to={225.45}
              href="/static/textures/jupiter_4k.png"
            />
            <Pattern
              id={cloudsPattern}
              duration={35}
              href="/static/textures/earth_cloud.png"
            />
            {/* Atmosphere */}
            {/* <linearGradient
            id={atmosphereGradient}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(130,90,80)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(90,40,30)" stopOpacity="0.5" />
          </linearGradient>
          
             */}
          </defs>
        </svg>
      </JupiterWrapper>
    </Root>
  );
}

export default Jupiter;
