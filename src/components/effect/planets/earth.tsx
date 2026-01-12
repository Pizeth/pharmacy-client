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
  height: "100vh",
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
      <svg id="earth" viewBox="-5 -5 110 110" width="700" height="700">
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
          {/* <mask id={atmosphereMask}>
            <rect x="-5" y="-5" width="110" height="110" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="55"
              fill={`url(#${atmosphereMaskGradient})`}
            />
          </mask>
          <mask id={waterMask}>
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="white"
              filter="url(#fisheye-filter)"
            />
          </mask>
          <mask id={groundMask}>
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${groundPattern})`}
              filter="url(#fisheye-filter)"
            />
          </mask> */}

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

          {/* <mask id={cloudsMask}>
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${cloudsPattern})`}
              filter="url(#fisheye-filter)"
            />
          </mask>
          <filter id="fisheye-filter" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feDisplacementMap in="SourceGraphic" in2="blur" scale="3" />
          </filter> */}

          {/* <pattern
            id={groundPattern}
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
              dur="50s"
              repeatCount="indefinite"
            />
            <image
              x="0"
              y="0"
              width="200"
              height="100"
              href="/static/textures/world_map.svg"
            />
          </pattern>
          <pattern
            id={cloudsPattern}
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
              dur="40s"
              repeatCount="indefinite"
            />
            <image
              x="0"
              y="0"
              width="200"
              height="100"
              href="/static/textures/earth_cloud.png"
            />
          </pattern> */}
        </defs>
      </svg>
    </Root>
  );
}

export default Earth;
