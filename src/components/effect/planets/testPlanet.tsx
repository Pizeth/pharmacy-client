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

// Simplify the wrapper - we'll handle shadows in SVG
const JupiterWrapper = styled("div", {
  name: PREFIX,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})(({ theme }) => ({
  position: "relative",
  borderRadius: "50%",
  overflow: "hidden",
  zIndex: 3,
}));

const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function JupiterTest() {
  return (
    <Root>
      <JupiterWrapper>
        <svg id="jupiter" viewBox="-0.5 -0.5 101 101" width="200" height="200">
          <g transform="rotate(3.2, 50, 50)">
            {/* The Core Jupiter Circle with the complex shadow filter */}
            <circle
              cx="50"
              cy="50"
              r="50"
              fill={`url(#${groundPattern})`}
              filter="url(#complex-inset-shadow)"
            />

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

            {/* Complex Inset Shadow Filter */}
            <filter
              id="complex-inset-shadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              {/* Base source for shadows */}
              <feFlood
                flood-color="#c3f4ff"
                flood-opacity="0"
                result="shadowSource"
              />

              {/* Outer white glow */}
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="0.1"
                flood-color="white"
                flood-opacity="0.2"
              />

              {/* First inner light blue glow */}
              <feFlood flood-color="#c3f4ff" result="color1" />
              <feComposite in2="SourceAlpha" operator="out" result="comp1" />
              <feGaussianBlur in="comp1" stdDeviation="0.4" result="blur1" />
              <feOffset dx="-0.05" dy="0" result="offset1" />
              <feComposite
                operator="over"
                in="offset1"
                in2="SourceGraphic"
                result="compOver1"
              />

              {/* Second inner black shadow */}
              <feFlood flood-color="black" result="color2" />
              <feComposite in2="SourceAlpha" operator="out" result="comp2" />
              <feGaussianBlur in="comp2" stdDeviation="1.25" result="blur2" />
              <feOffset dx="1.5" dy="0.2" result="offset2" />
              <feComposite
                operator="over"
                in="offset2"
                in2="SourceGraphic"
                result="compOver2"
              />

              {/* Third inner light blue glow with transparency */}
              <feFlood
                flood-color="#c3f4ff"
                flood-opacity="0.6"
                result="color3"
              />
              <feComposite in2="SourceAlpha" operator="out" result="comp3" />
              <feGaussianBlur in="comp3" stdDeviation="1.7" result="blur3" />
              <feOffset dx="-2.4" dy="-0.2" result="offset3" />
              <feComposite
                operator="over"
                in="offset3"
                in2="SourceGraphic"
                result="compOver3"
              />

              {/* Fourth large black inner shadow */}
              <feFlood
                flood-color="black"
                flood-opacity="0.4"
                result="color4"
              />
              <feComposite in2="SourceAlpha" operator="out" result="comp4" />
              <feGaussianBlur in="comp4" stdDeviation="2.2" result="blur4" />
              <feOffset dx="25" dy="0" result="offset4" />
              <feComposite
                operator="over"
                in="offset4"
                in2="SourceGraphic"
                result="compOver4"
              />

              {/* Fifth medium black inner shadow */}
              <feFlood
                flood-color="black"
                flood-opacity="0.666"
                result="color5"
              />
              <feComposite in2="SourceAlpha" operator="out" result="comp5" />
              <feGaussianBlur in="comp5" stdDeviation="1.9" result="blur5" />
              <feOffset dx="15" dy="0" result="offset5" />
              <feComposite
                operator="over"
                in="offset5"
                in2="SourceGraphic"
                result="compOver5"
              />

              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="offset1" />
                <feMergeNode in="offset2" />
                <feMergeNode in="offset3" />
                <feMergeNode in="offset4" />
                <feMergeNode in="offset5" />
              </feMerge>
            </filter>

            {/* Alternative Simplified Filter (often works better) */}
            <filter
              id="jupiter-shadow-simple"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="0.1"
                flood-color="white"
                flood-opacity="0.2"
              />

              <feMorphology
                operator="dilate"
                radius="0.5"
                in="SourceAlpha"
                result="thicker"
              />
              <feGaussianBlur in="thicker" stdDeviation="1" result="blurred" />

              <feFlood flood-color="#c3f4ff" result="blueGlow" />
              <feComposite
                in="blueGlow"
                in2="blurred"
                operator="in"
                result="blueInner"
              />
              <feOffset dx="-0.5" dy="0" />

              <feFlood flood-color="black" result="blackShadow" />
              <feComposite
                in="blackShadow"
                in2="blurred"
                operator="in"
                result="blackInner"
              />
              <feOffset dx="1.5" dy="0.2" />

              <feMerge>
                <feMergeNode in="blueInner" />
                <feMergeNode in="blackInner" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

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
            </linearGradient>

            <Pattern
              id={groundPattern}
              duration={60}
              width={225.45}
              to={225.45}
              href="/static/textures/jupiter_4k.png"
            />

            <Pattern
              id={cloudsPattern}
              duration={35}
              href="/static/textures/earth_cloud.png"
            />
          </defs>
        </svg>
      </JupiterWrapper>
    </Root>
  );
}

export default JupiterTest;
