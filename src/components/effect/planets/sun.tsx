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
  //   animation: `${sunRotate} 30s linear 0s infinite, ${shadowPulse} 5s ease-in-out infinite`,
  //   boxShadow:
  //     "0px 0px 40px 20px RGBA(255, 140, 0, 0.8), -5px 0px 10px 1px #ffb453 inset, 15px 2px 40px 20px #bb6d01c5 inset, -24px -2px 50px 25px #ffa265c2 inset, 150px 0px 80px 35px #c55f00aa inset",
}));

function Sun() {
  return (
    <Root>
      <svg id="sun" viewBox="-10 -10 120 120" width="700" height="700">
        <defs>
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
          <filter id="fisheye-filter" x="0%" y="0%" width="100%" height="100%">
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

          {/* Sun Glow Filter */}
          <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial Gradient for depth/heat */}
          <radialGradient id="sun-gradient">
            <stop offset="0%" stopColor="rgba(255, 255, 200, 0)" />
            <stop offset="85%" stopColor="rgba(255, 150, 0, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 50, 0, 0.8)" />
          </radialGradient>
        </defs>

        <g transform="rotate(23.5, 50, 50)">
          <rect
            id="layer-ground"
            x="0"
            y="0"
            width="100"
            height="100"
            fill="rgba(0, 100, 0, 1)"
            mask="url(#ground-mask)"
          />

          {/* The Core Sun Circle */}
          <circle
            cx="50"
            cy="50"
            r="50"
            fill="url(#sun-pattern)"
            filter="url(#sun-glow)"
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
            fill="rgba(255, 255, 255, .6)"
            filter="url(#glare-blur-filter)"
          />
        </g>
      </svg>
    </Root>
  );
}

export default Sun;
