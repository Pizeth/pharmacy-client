import { shadowPulse, sunRotate } from "@/theme/keyframes";
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
  height: "100vh",
  backgroundColor: "#050505", // Dark background to see the glow
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
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
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
              fill="url(#sun-pattern)"
              // filter="url(#sun-glow)"
            />

            <circle
              id="layer-cloud"
              cx="50"
              cy="50"
              r="50"
              fill="url(#sun-gradient)"
              mask="url(#sun-mask)"
            />

            {/* Overlay Gradient to give it a spherical/hot edge look */}
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="url(#sun-gradient)"
              pointerEvents="none"
            />

            <circle
              id="layer-glare"
              cx="35"
              cy="35"
              r="20"
              fill="rgba(208, 0, 0, 0.55)"
              filter="url(#glare-blur-filter)"
            />
          </g>
          <defs>
            <mask id="sun-mask">
              <rect x="0" y="0" width="100" height="100" fill="black" />
              <circle
                cx="50"
                cy="50"
                r="50"
                fill="url(#clouds-pattern)"
                filter="url(#fisheye-filter)"
              />
            </mask>
            <filter
              id="fisheye-filter"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feDisplacementMap in="SourceGraphic" in2="blur" scale="3" />
            </filter>
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

            {/* Radial Gradient for depth/heat */}
            <radialGradient id="sun-gradient">
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

            {/* Scrolling Sun Surface Pattern */}
            <pattern
              id="sun-pattern"
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
                href="/static/textures/sun.png" // Replace with your sun texture path
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
      </SunWrapper>
    </Root>
  );
}

export default Sun;
