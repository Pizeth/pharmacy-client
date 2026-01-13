import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

const PREFIX = "RazethPlanetMars";
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

function Mars() {
  const clouds = [
    { id: 1, dur: 13, color: "rgba(160, 40, 0, .5)" },
    { id: 2, dur: 17, color: "rgba(200, 60, 0, .5)" },
    { id: 3, dur: 19, color: "rgba(255, 100, 0, .5)" },
  ];

  return (
    <Root>
      <svg id="mars" viewBox="-5 -5 110 110" width="700" height="700">
        <g transform="rotate(25.2, 50, 50)">
          {/* Base Layers (Water and Ground) */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(100, 50, 50, 1)"
            mask={`url(#${waterMask})`}
          />
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(255, 130, 100, 1)"
            mask={`url(#${groundMask})`}
          />

          {/* Render Cloud Layers via Map */}
          {clouds.map((cloud) => (
            <rect
              key={cloud.id}
              x="0"
              y="0"
              width="100"
              height="100"
              fill={cloud.color}
              mask={`url(#${cloudsMask}-${cloud.id})`}
            />
          ))}

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
            id="layer-glare"
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

          {/* Gradient and Mask for Atmosphere */}
          <linearGradient
            id={atmosphereGradient}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(255,150,100)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(200,100,50)" stopOpacity=".5" />
          </linearGradient>
          <radialGradient
            id={atmosphereMaskGradient}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            {/* <stop offset="50%" style={{ stopColor: "white", stopOpacity: 0 }} />
            <stop offset="90%" style={{ stopColor: "white", stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            /> */}
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

          {/* Water and Ground */}
          <CircleMask id={waterMask} pattern="white" />
          <Pattern
            id={groundPattern}
            duration={30}
            href="/static/textures/mars.png"
          />
          <CircleMask id={groundMask} pattern={`url(#${groundPattern})`} />

          {/* Generate Definitions dynamically */}
          {clouds.map((cloud) => (
            <Fragment key={cloud.id}>
              <Pattern
                id={`${cloudsPattern}-${cloud.id}`}
                duration={cloud.dur}
                href="/static/textures/earth_cloud.png"
              />
              <CircleMask
                id={`${cloudsMask}-${cloud.id}`}
                pattern={`url(#${cloudsPattern}-${cloud.id}`}
              />
            </Fragment>
          ))}
        </defs>
      </svg>
    </Root>
  );
}

export default Mars;
