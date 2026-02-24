import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";

const PREFIX = "RazethPlanetEarth";
const Root = styled("div", {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
  // })(({ theme }) => ({
})<{ size?: number }>(({ theme, size = 100 }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "5vmin",
  height: `${size}vmin`, // Dynamic height
}));

// Create a styled wrapper that matches the Sun's shape
const EarthWrapper = styled("div", {
  name: PREFIX,
  slot: "Content",
  shouldForwardProp: (prop: string) => prop !== "sizeFactor",
  overridesResolver: (_props, styles) => styles.content,
  // })(({ theme }) => ({
})<{ sizeFactor: number }>(({ theme, sizeFactor }) => ({
  position: "relative",
  aspectRatio: "1 / 1",
  borderRadius: "50%", // Keeps the shadow circular
  // Set a base font-size for em units to scale from
  fontSize: `${sizeFactor}vmin`,

  // backgroundBlendMode: "multiply",
  height: "85%", // ← Add this: adjust 80–95% (85% fills and leave some space)
  background: "transparent", // REQUIRED for inset shadows
  overflow: "hidden", // Ensures the SVG texture doesn't spill out
  "--size-factor": sizeFactor, // Critical CSS variable for scaling
  willChange: "transform",
  transform: "translate3d(0,0,0)",
  backfaceVisibility: "hidden",

  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    pointerEvents: "none", // Ensures you can still click/hover the planet underneath
    zIndex: 10, // Must be higher than the SVG's stacking context
    boxShadow: `
      /* 1. Outer Atmosphere (Halo) */
      0 0 0.05em -0.01em rgb(70, 89, 181, 0.5),
      /* softer sky-blue halo */
      0 0 0.08em 0.02em rgba(135, 206, 255, 0.3), 

      /* 2. Sunlit Surface Highlight (Left) */
      inset 0.02em 0 0.04em -0.01em rgb(61, 76, 169, 0.7),

      /* 3. Rayleigh Scattering (Mid-Atmosphere) */
      inset 0.04em 0 0.09em 0px rgb(60, 75, 170, 0.5),

      /* 4. The Terminator (Shadow Start) */
      inset -0.04em 0 0.15em 0px rgba(0,0,0,0.5),

      /* 5. Deep Space Night (Far Right) */
      inset -0.1em 0 0.12em 0.04em rgba(0,0,0,0.7)
    `,
  },

  "& .glow": {
    position: "absolute",
  },
}));

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const cloudsMask = `${PREFIX}-clouds-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const lightFilter = `${PREFIX}-light-filter`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;
const sphericalWarp = `${PREFIX}-spherical-warp`;

function Earth({ size = 90 }: { size?: number }) {
  const sizeFactor = size; // Prevents glow disappearance at tiny sizes
  return (
    <Root size={size}>
      <EarthWrapper sizeFactor={sizeFactor}>
        {/* <svg viewBox="0 -0 100 100" width="100%" height="100%" className="glow">
          <filter id="blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <filter id="turb" x="-100%" y="-100%" width="300%" height="300%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="102.5"
              result="turbulence"
              seed="69"
            />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5">
              <animate
                attributeName="scale"
                values="5;9;2;5"
                dur="5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
          <circle
            cx="52"
            cy="48"
            r="45"
            fill="rgb(20, 24, 87)"
            filter="url(#blur) url(#turb)"
          ></circle>
        </svg> */}
        <svg
          id="earth"
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        >
          <g>
            {/* <g transform="rotate(23.5, 0, 0)"> */}
            <g>
              {/* Base Layers (Water, Ground and Clouds) */}
              <g filter={`url(#${sphericalWarp})`}>
                <g transform="scale(1.5 1.5)">
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    // fill="rgba(0, 0, 200, 1)"
                    fill="url(#oceanGrad)"
                    mask={`url(#${waterMask})`}
                  />
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    // fill="rgba(0, 100, 0, 1)"
                    // fill="transparent"
                    // filter={`url(#${lightFilter})`}
                    fill="url(#earthSurface)"
                    mask={`url(#${groundMask})`}
                    // filter={`url(#${sphericalWarp})`}
                  />
                </g>
              </g>
            </g>

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
              cx="5"
              cy="85"
              r="25"
              // fill="rgba(255, 255, 255, .5)"
              fill="rgba(255, 255, 255, 0.35)"
              filter="url(#glare-blur-filter)"
              overflow={"hidden"}
            />
          </g>
          <defs>
            {/* Filters */}
            {/* <Filter id={FISHEYE_ID} /> */}
            {/* Spherical Warp Filter - Creates the 3D wrap effect */}

            <filter
              id={sphericalWarp}
              filterUnits="userSpaceOnUse"
              height="100%"
              width="100%"
              x="0"
              y="0"
            >
              <feImage
                id="feImg"
                href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 100 100'%3E %3Cdefs%3E %3C!-- Red and blue gradients for X/Y displacement --%3E %3ClinearGradient id='redGradient20' x1='1' x2='0' y1='0' y2='0' color-interpolation='sRGB' gradientUnits='objectBoundingBox'%3E %3Cstop offset='0%25' stop-color='rgb(255,0,0)' /%3E %3Cstop offset='100%25' stop-color='rgba(255,0,0,0)' /%3E %3C/linearGradient%3E %3ClinearGradient id='blueGradient20' x1='0' x2='0' y1='1' y2='0' color-interpolation='sRGB' gradientUnits='objectBoundingBox'%3E %3Cstop offset='0%25' stop-color='rgb(0,0,255)' /%3E %3Cstop offset='100%25' stop-color='rgba(0,0,255,0)' /%3E %3C/linearGradient%3E %3CradialGradient id='orthographicGradient' cx='0.5' cy='0.5' r='0.5'%3E %3Cstop offset='0%25' stop-color='white' stop-opacity='0.000' /%3E %3Cstop offset='10%25' stop-color='white' stop-opacity='0.005' /%3E %3Cstop offset='20%25' stop-color='white' stop-opacity='0.020' /%3E %3Cstop offset='30%25' stop-color='white' stop-opacity='0.046' /%3E %3Cstop offset='40%25' stop-color='white' stop-opacity='0.083' /%3E %3Cstop offset='50%25' stop-color='white' stop-opacity='0.134' /%3E %3Cstop offset='60%25' stop-color='white' stop-opacity='0.200' /%3E %3Cstop offset='70%25' stop-color='white' stop-opacity='0.286' /%3E %3Cstop offset='80%25' stop-color='white' stop-opacity='0.400' /%3E %3Cstop offset='90%25' stop-color='white' stop-opacity='0.564' /%3E %3Cstop offset='100%25' stop-color='white' stop-opacity='1.000' /%3E %3C/radialGradient%3E %3C!-- Apply as mask --%3E %3Cmask id='displacementMask'%3E %3Crect width='100' height='100' fill='black' /%3E %3Ccircle cx='50' cy='50' r='50' fill='url(%23orthographicGradient)' /%3E %3C/mask%3E %3C/defs%3E %3C!-- Neutral gray background --%3E %3Crect fill='rgb(127,127,127)' width='100' height='100' /%3E %3Cg mask='url(%23displacementMask)'%3E %3Crect fill='rgb(0,255,0)' width='100' height='100' /%3E %3Crect style='mix-blend-mode: normal' fill='url(%23redGradient20)' width='100' height='100' /%3E %3Crect style='mix-blend-mode: exclusion' fill='url(%23blueGradient20)' width='100' height='100' /%3E %3C/g%3E%3C/svg%3E"
                width="100%"
                height="100%"
                x="0"
                y="0"
                result="dispMap"
              />
              <feDisplacementMap
                id="scl"
                in="SourceGraphic"
                in2="dispMap"
                scale="90"
                xChannelSelector="R"
                yChannelSelector="B"
              />
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
            {/* Earth Filter */}
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
            <filter id="my-filter">
              <feComponentTransfer>
                <feFuncR type="linear" slope="2" />
                <feFuncG type="linear" slope="2" />
                <feFuncB type="linear" slope="2" />
              </feComponentTransfer>
            </filter>

            <filter
              id={lightFilter}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feImage
                href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g' cx='15%25' cy='35%25' r='75%25'%3E%3Cstop offset='0%25' stop-color='%23fff'/%3E%3Cstop offset='100%25' stop-color='%23000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3C/svg%3E"
                result="lens"
              />
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="0"
                result="lens"
              />
              <feDisplacementMap in="SourceGraphic" in2="lens" scale="3" />
              <feSpecularLighting
                in="SourceAlpha"
                result="specOut"
                specularConstant="1.5"
                specularExponent="25"
                lightingColor="#ffffee"
                // lightingColor={`url(#${atmosphereGradient})`}
              >
                <fePointLight x="15" y="50" z="25" />
              </feSpecularLighting>

              <feComposite
                in="SourceGraphic"
                in2="specOut"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
              />
            </filter>

            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="85%">
              <stop offset="0%" stopColor="rgb(1, 1, 35)" />
              <stop offset="50%" stopColor="rgb(5, 5, 55)" />
              <stop offset="65%" stopColor="rgb(16, 17, 73)" />
              <stop offset="85%" stopColor="rgb(14, 20, 84)" />
              <stop offset="100%" stopColor="rgb(24, 31, 99)" />
            </radialGradient>
            {/* Atmosphere */}
            <linearGradient
              id={atmosphereGradient}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgb(255, 2555, 255, 1)" />
              <stop offset="25%" stopColor="rgb(72, 89, 180, 0.15)" />
              <stop
                offset="100%"
                stopColor="rgb(20, 24, 87)"
                stopOpacity="0.25"
              />
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
            {/* Sphere Displacement Map (hidden element used by filter) */}
            <radialGradient
              id="sphereDisplacementMap"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="rgb(128, 128, 128)" />
              <stop offset="60%" stopColor="rgb(140, 140, 140)" />
              <stop offset="85%" stopColor="rgb(180, 180, 180)" />
              <stop offset="100%" stopColor="rgb(128, 128, 128)" />
            </radialGradient>
            <CircleMask
              id={atmosphereMask}
              x={-5}
              y={-5}
              width={110}
              height={110}
              r={55}
              pattern={`url(#${atmosphereMaskGradient})`}
              // fill="white"
              filterId={lightFilter}
            />
            {/* Water, Ground and Clouds */}
            <CircleMask id={waterMask} pattern="white" fill="white" />
            <CircleMask
              id={groundMask}
              pattern={`url(#${groundPattern})`}
              // fill="white"
              // filterId={sphericalWarp}
            />
            <CircleMask
              id={cloudsMask}
              pattern={`url(#${cloudsPattern})`}
              fill={`url(#${atmosphereGradient})`}
            />
            <Pattern
              id={groundPattern}
              x="0"
              y="0"
              duration={10}
              href="/static/textures/globe-01.svg"
            />
            <Pattern
              id={"earthSurface"}
              x="-50"
              y="-50"
              duration={10}
              // href="/static/textures/globe.jpg"
              // width="100" // matches your viewBox width
              // height="100" // matches your viewBox height
              href="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/3840px-Blue_Marble_2002.png"
            />
            <Pattern
              id={cloudsPattern}
              duration={45}
              href="/static/textures/earth_cloud.png"
            />
          </defs>
        </svg>
      </EarthWrapper>
    </Root>
  );
}

export default Earth;
