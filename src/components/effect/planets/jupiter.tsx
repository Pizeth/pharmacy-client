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
  height: "100vh",
}));

// 1. Create a styled wrapper that matches the Sun's shape
const JupiterWrapper = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "relative",
  // width: "700px", // Match your SVG width
  // height: "700px", // Match your SVG height
  borderRadius: "50%", // Keeps the shadow circular
  // Applying your requested complex shadow
  // boxShadow: `
  //   0px 0px 2vmin 1vmin rgba(255, 74, 0, 0.76),
  //   -0.25vmin 0px 0.5vmin 0.05vmin rgba(255, 26, 0, 0.8) inset,
  //   0.75vmin 0.1vmin 2vmin 1vmin rgba(255, 38, 0, 0.79) inset,
  //   1.2vmin 0.1vmin 2.5vmin 1.25vmin rgba(255, 50, 0, 0.78) inset,
  //   7.5vmin 0px 4vmin 1.75vmin rgba(255, 62, 0, 0.77) inset
  // `,
  overflow: "hidden", // Ensures the SVG texture doesn't spill out
  // animation: `${shadowPulse} 5s ease-in-out infinite`,
}));

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function Jupiter() {
  return (
    <Root>
      <svg id="jupiter" viewBox="-5 -5 110 110" width="700" height="700">
        <g transform="rotate(3.2, 50, 50)">
          {/* The Core Jupiter Circle */}
          <circle
            cx="50"
            cy="50"
            r="50"
            // fill={`url(#${groundPattern})`}
            // filter="url(#jupiter-glow)"
          />
          {/* Base Layers (Water and Ground) */}
          {/* <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(130, 130, 130, 1)"
            mask={`url(#${waterMask})`}
          />
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(90, 40, 0, 1)"
            mask={`url(#${groundMask})`}
          /> */}
          {/* Atmosphere and Glare */}
          {/* <rect
            x="-5"
            y="-5"
            width="110"
            height="110"
            fill={`url(#${atmosphereGradient})`}
            mask={`url(#${atmosphereMask})`}
          /> */}

          <circle
            cx="50"
            cy="50"
            r="50"
            fill="url(#jupiter-gradientt)"
            mask="url(#jupiter-mask)"
          />

          {/* Overlay Gradient to give it a spherical/hot edge look */}
          <circle
            cx="50"
            cy="50"
            r="50"
            fill={`url(#${atmosphereGradient})`}
            pointerEvents="none"
          />

          <circle
            cx="35"
            cy="35"
            r="20"
            fill="rgba(255, 255, 255, .6)"
            filter="url(#glare-blur-filter)"
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
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* <mask id="jupiter-mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="url(#clouds-pattern)"
              filter="url(#fisheye-filter)"
            />
          </mask> */}
          <CircleMask id="jupiter-mask" pattern={`url(#clouds-pattern)`} />

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

          <linearGradient
            id={atmosphereGradient}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0.4%" stopColor="rgb(255, 208, 142, 0.75)" />
            <stop offset="3.8%" stopColor="rgb(215, 189, 140, 0.7)" />
            <stop offset="7.2%" stopColor="rgb(173, 159, 122, 0.65)" />
            <stop offset="10.6%" stopColor="rgb(141, 127, 92, 0.6)" />
            <stop offset="14%" stopColor="rgb(167, 152, 111, 0.55)" />
            <stop offset="17.4%" stopColor="rgb(183, 165, 125, 0.5)" />
            <stop offset="20.8%" stopColor="rgb(216, 213, 196, 0.45)" />
            <stop offset="24.2%" stopColor="rgb(188, 155, 114, 0.4)" />
            <stop offset="27.6%" stopColor="rgb(212, 195, 165, 0.35)" />
            <stop offset="31%" stopColor="rgb(177, 135, 110, 0.3)" />
            <stop offset="34.4%" stopColor="rgb(148, 102, 76, 0.25)" />
            <stop offset="37.8%" stopColor="rgb(198, 157, 94, 0.2)" />
            <stop offset="41.2%" stopColor="rgb(172, 128, 109, 0.15)" />
            <stop offset="44.6%" stopColor="rgb(167, 142, 113, 0.1)" />
            <stop offset="50%" stopColor="rgb(194, 103, 20, 0.05)" />
            <stop offset="56.5%" stopColor="rgb(167, 142, 113, 0.1)" />
            <stop offset="59.9%" stopColor="rgb(172, 128, 109, 0.15)" />
            <stop offset="63.3%" stopColor="rgb(198, 157, 94, 0.2)" />
            <stop offset="66.7%" stopColor="rgb(148, 102, 76, 0.25)" />
            <stop offset="70.1%" stopColor="rgb(177, 135, 110, 0.3)" />
            <stop offset="73.5%" stopColor="rgb(212, 195, 165, 0.35)" />
            <stop offset="76.9%" stopColor="rgb(188, 155, 114, 0.4)" />
            <stop offset="80.3%" stopColor="rgb(216, 213, 196, 0.45)" />
            <stop offset="83.7%" stopColor="rgb(183, 165, 125, 0.5)" />
            <stop offset="87.1%" stopColor="rgb(167, 152, 111, 0.55)" />
            <stop offset="90.5%" stopColor="rgb(141, 127, 92, 0.6)" />
            <stop offset="93.9%" stopColor="rgb(173, 159, 122, 0.65)" />
            <stop offset="97.3%" stopColor="rgb(215, 189, 140, 0.7)" />
            <stop offset="100%" stopColor="rgb(255, 208, 142, 0.75)" />
          </linearGradient>

          {/* Scrolling Jupiter Surface Pattern */}
          {/* <pattern
            id="jupiter-pattern"
            patternUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="100"
          >
            <animate
              attributeName="x"
              from="0"
              to="200"
              dur="60s"
              repeatCount="indefinite"
            />
            <image
              x="0"
              y="0"
              width="200"
              height="100"
              href="/static/textures/jupiter_4k.png"
            />
          </pattern> */}
          <Pattern
            id={groundPattern}
            duration={60}
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
          </radialGradient> */}

          {/* <CircleMask id={atmosphereMask} pattern={`url(#${atmosphereGradient})`} /> */}
          {/* <CircleMask
            id={atmosphereMask}
            x={-5}
            y={-5}
            width={110}
            height={110}
            r={55}
            pattern={`url(#${atmosphereMaskGradient})`}
          /> */}
          {/* <CircleMask id={waterMask} pattern="white" />
          <CircleMask id={groundMask} pattern={`url(#${groundPattern})`} /> */}
        </defs>
      </svg>
    </Root>
  );
}

export default Jupiter;
