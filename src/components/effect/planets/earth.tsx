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

function Earth() {
  return (
    <Root>
      <svg id="earth" viewBox="-5 -5 110 110" width="700" height="700">
        <g transform="rotate(23.5, 50, 50)">
          <rect
            id="layer-water"
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(0, 0, 200, 1)"
            mask="url(#water-mask)"
          />
          <rect
            id="layer-ground"
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(0, 100, 0, 1)"
            mask="url(#ground-mask)"
          />
          <rect
            id="layer-clouds"
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(255, 255, 255, .8)"
            mask="url(#clouds-mask)"
          />
          <rect
            id="layer-atmosphere"
            x="-5"
            y="-5"
            width="110"
            height="110"
            fill="url(#atmosphere-gradient)"
            mask="url(#atmosphere-mask)"
          />
          <circle
            id="layer-glare"
            cx="35"
            cy="35"
            r="20"
            fill="rgba(255, 255, 255, .6)"
            filter="url(#glare-blur-filter)"
          />
        </g>
        <defs>
          <linearGradient
            id="atmosphere-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(0,127,255)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(0,0,255)" stopOpacity=".5" />
          </linearGradient>
          <mask id="atmosphere-mask">
            <rect x="-5" y="-5" width="110" height="110" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="55"
              fill="url(#atmosphere-mask-gradient)"
            />
          </mask>
          <mask id="water-mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="white"
              filter="url(#fisheye-filter)"
            />
          </mask>
          <mask id="ground-mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="url(#ground-pattern)"
              filter="url(#fisheye-filter)"
            />
          </mask>
          <mask id="clouds-mask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="url(#clouds-pattern)"
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
          </filter>
          <radialGradient
            id="atmosphere-mask-gradient"
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
          <filter
            id="glare-blur-filter"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <pattern
            id="ground-pattern"
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
            id="clouds-pattern"
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
          </pattern>
        </defs>
      </svg>
    </Root>
  );
}

export default Earth;
