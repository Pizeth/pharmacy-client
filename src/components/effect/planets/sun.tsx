import { shadowPulse, sunRotate } from "@/theme/keyframes";
import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material/styles";

const PREFIX = "RazethPlanetSun";
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
  height: "100%",
  width: "100%",
  effect: {
    "& ::before": {
      content: "''",
      position: "absolute",
      // top:50%;
      // left:50%;
      // height:100%;
      // width:100%;
      // transform:translate(-50%,-50%);
      borderRadius: "50%",
      backgroundImage:
        "radial-gradient(rgba(255,255,0,0) 40%, rgba(255,255,0,0.75))",
    },
  },
  // backgroundColor: "#050505", // Dark background to see the glow
  //   height: "300px",
  //   width: "300px",
  //   position: "relative",
  //   transition: "left 0.3s linear",
  //   backgroundImage: `url('/static/textures/sun.png')`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "left",
  //   bottom: 0,
  //   borderRadius: "50%",
  // animation: `${sunRotate} 30s linear 0s infinite, ${shadowPulse} 5s ease-in-out infinite`,
  // boxShadow:
  //   "0px 0px 40px 20px RGBA(255, 140, 0, 0.8), -5px 0px 10px 1px #ffb453 inset, 15px 2px 40px 20px #bb6d01c5 inset, -24px -2px 50px 25px #ffa265c2 inset, 150px 0px 80px 35px #c55f00aa inset",
}));

// 1. Create a styled wrapper that matches the Sun's shape
const SunWrapper = styled("div", {
  name: PREFIX,
  slot: "Effect",
  overridesResolver: (_props, styles) => styles.effect,
})(({ theme }) => ({
  // width: "100vmin",
  // height: "100vmin",
  position: "relative",
  // width: "700px", // Match your SVG width
  // height: "700px", // Match your SVG height
  borderRadius: "50%", // Keeps the shadow circular
  // Applying your requested complex shadow
  boxShadow: `
    0px 0px 2vmin 1vmin rgba(255, 74, 0, 0.76),
    -0.25vmin 0px 0.5vmin 0.05vmin rgba(255, 26, 0, 0.8) inset,
    0.75vmin 0.1vmin 2vmin 1vmin rgba(255, 38, 0, 0.79) inset,
    1.2vmin 0.1vmin 2.5vmin 1.25vmin rgba(255, 50, 0, 0.78) inset,
    7.5vmin 0px 4vmin 1.75vmin rgba(255, 62, 0, 0.77) inset
  `,
  overflow: "hidden", // Ensures the SVG texture doesn't spill out
  animation: `${shadowPulse} 5s ease-in-out infinite`,
}));

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const cloudsMask = `${PREFIX}-clouds-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function Sun() {
  return (
    <Root>
      <SunWrapper>
        <svg id="sun" viewBox="0 0 100 100" width="700" height="700">
          <g transform="rotate(23.5, 50, 50)">
            {/* The Core Sun Circle */}

            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${groundPattern})`}
              // filter="url(#sun-glow)"
              // mask={`url(#${atmosphereMask})`}
            />

            {/* <rect width="100" height="100" fill="rgb(229,3,33, 0.25)" /> */}

            <rect
              width="100"
              height="100"
              filter="url(#sun-flare)"
              opacity={"0.25"}
            />

            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill={"rgb(229,3,33, 0.5)"}
              mask={`url(#${cloudsMask})`}
            />
            {/* 
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${atmosphereGradient})`}
              mask={`url(#${atmosphereMask})`}
            /> */}

            {/* Overlay Gradient to give it a spherical/hot edge look */}
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${atmosphereGradient})`}
              mask={`url(#${atmosphereMask})`}
              pointerEvents="none"
            />

            <circle
              id="layer-glare"
              cx="35"
              cy="35"
              r="20"
              fill="rgba(208, 0, 0, 0.55)"
              filter="url(#glare-blur-filter)"
              overflow="hidden"
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

            {/* Sun Glow Filter */}
            <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Sun Flare Filter */}
            <filter id="sun-flare">
              <feTurbulence baseFrequency="0.05" numOctaves="5" seed="5" />
              <feColorMatrix type="hueRotate" values="0">
                <animate
                  attributeName="values"
                  from="0"
                  to="360"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </feColorMatrix>
              <feColorMatrix values="4.2 2.6 5 3 0 -2.6 1.4 -1.6 -2.8 3.2 -4.2 4.3 4.8 -5 -2.9 1.6 0.4 -0.5 0 0.1"></feColorMatrix>
            </filter>

            {/* <mask id={atmosphereMask}>
              <rect x="0" y="0" width="100" height="100" fill="black" />
              <circle
                cx="50"
                cy="50"
                r="50"
                fill="url(#clouds-pattern)"
                filter="url(#fisheye-filter)"
              />
            </mask> */}
            <CircleMask id={cloudsMask} pattern={`url(#${cloudsPattern})`} />

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
              <stop offset="50%" stopColor="white" stopOpacity="0" />
              <stop offset="90%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Radial Gradient for depth/heat */}
            <radialGradient id={atmosphereGradient + "1"}>
              {/* <stop offset="0%" stopColor="rgba(255, 255, 200, 0)" />
            <stop offset="85%" stopColor="rgba(255, 150, 0, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 50, 0, 0.8)" /> */}
              <stop offset="0%" stopColor="rgba(255, 248, 0, 0.05)" />
              <stop offset="5%" stopColor="rgba(255, 236, 0, 0.1)" />
              <stop offset="10%" stopColor="rgba(255, 224, 0, 0.15)" />
              <stop offset="15%" stopColor="rgba(255, 218, 0, 0.2)" />
              <stop offset="20%" stopColor="rgba(255, 206, 0, 0.25)" />
              <stop offset="25%" stopColor="rgba(255, 194, 0, 0.3)" />
              <stop offset="30%" stopColor="rgba(255, 182, 0, 0.35)" />
              <stop offset="35%" stopColor="rgba(255, 170, 0, 0.4)" />
              <stop offset="40%" stopColor="rgba(255, 158, 0, 0.45)" />
              <stop offset="45%" stopColor="rgba(255, 146, 0, 0.5)" />
              <stop offset="50%" stopColor="rgba(255, 134, 0, 0.55)" />
              <stop offset="55%" stopColor="rgba(255, 122, 0, 0.6)" />
              <stop offset="60%" stopColor="rgba(255, 110, 0, 0.65)" />
              <stop offset="70%" stopColor="rgba(255, 98, 0, 0.7)" />
              <stop offset="75%" stopColor="rgba(255, 86, 0, 0.75)" />
              <stop offset="80%" stopColor="rgba(255, 74, 0, 0.76)" />
              <stop offset="85%" stopColor="rgba(255, 62, 0, 0.77)" />
              <stop offset="90%" stopColor="rgba(255, 50, 0, 0.78)" />
              <stop offset="95%" stopColor="rgba(255, 38, 0, 0.79)" />
              <stop offset="100%" stopColor="rgba(255, 26, 0, 0.8)" />
            </radialGradient>

            <radialGradient
              id={atmosphereGradient}
              cx="30%"
              cy="30%"
              r="75%"
              fx="25%"
              fy="25%"
            >
              <stop offset="0%" stopColor="rgba(255, 255, 200, 0)" />
              <stop offset="50%" stopColor="rgba(255, 215, 0, 0.25)" />
              <stop offset="75%" stopColor="rgba(255, 140, 0, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 69, 0, 0.75)" />
            </radialGradient>

            {/* Scrolling Sun Surface Pattern */}
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
                href="/static/textures/sun.png"
              />
            </pattern> */}

            <Pattern
              id={groundPattern}
              duration={75}
              href="/static/textures/sun.png"
            />

            <Pattern
              id={cloudsPattern}
              duration={150}
              from={0}
              to={-200}
              href="/static/textures/earth_cloud.png"
            />

            {/* <pattern
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
            </pattern> */}
          </defs>
        </svg>
      </SunWrapper>
    </Root>
  );
}

export default Sun;
