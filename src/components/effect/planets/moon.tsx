import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";
import { RectangleGogglesIcon } from "lucide-react";

const PREFIX = "RazethPlanetMoon";
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

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;

function Moon() {
  return (
    <Root>
      <svg id="moon" viewBox="-5 -5 110 110" width="700" height="700">
        <g transform="rotate(18.7, 50, 50)">
          {/* Base Layers (Water and Ground) */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(0, 0, 0, 1)"
            mask={`url(#${waterMask})`}
          />
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(200, 200, 200, 1)"
            mask={`url(#${groundMask})`}
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
            cx="35"
            cy="35"
            r="20"
            fill="rgba(255, 255, 255, .4)"
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

          {/* Atmosphere */}
          <linearGradient
            id={atmosphereGradient}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(255,255,255)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(255,255,255)" stopOpacity=".1" />
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
          {/* <mask id={atmosphereMask}>
            <rect x="-5" y="-5" width="110" height="110" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="52"
              fill={`url(#${atmosphereMaskGradient})`}
            />
          </mask> */}
          <CircleMask
            id={atmosphereMask}
            x={-5}
            y={-5}
            width={110}
            height={110}
            r={53}
            pattern={`url(#${atmosphereMaskGradient})`}
          />
          <CircleMask id={waterMask} pattern="white" />
          <CircleMask id={groundMask} pattern={`url(#${groundPattern})`} />
          <Pattern
            id={groundPattern}
            duration={30}
            href="/static/textures/moon.png"
          />
        </defs>
      </svg>
    </Root>
  );
}

export default Moon;
