// import { FISHEYE_ID } from "@/types/constants";
// import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
// import { styled } from "@mui/material";

// const PREFIX = "RazethPlanetJupiter";
// const Root = styled("div", {
//   name: PREFIX,
//   slot: "Root",
//   overridesResolver: (_props, styles) => styles.root,
// })(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   minHeight: "15vmin",
//   height: "100vh",
// }));

// // Simplify the wrapper - we'll handle shadows in SVG
// const JupiterWrapper = styled("div", {
//   name: PREFIX,
//   slot: "Content",
//   overridesResolver: (_props, styles) => styles.content,
// })(({ theme }) => ({
//   position: "relative",
//   borderRadius: "50%",
//   overflow: "hidden",
//   zIndex: 3,
// }));

// const waterMask = `${PREFIX}-water-mask`;
// const groundMask = `${PREFIX}-ground-mask`;
// const atmosphereMask = `${PREFIX}-atmosphere-mask`;
// const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
// const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
// const groundPattern = `${PREFIX}-ground-pattern`;
// const cloudsPattern = `${PREFIX}-clouds-pattern`;

// function JupiterTest() {
//   return (
//     <Root>
//       <JupiterWrapper>
//         <svg id="jupiter" viewBox="-0.5 -0.5 101 101" width="200" height="200">
//           <g transform="rotate(3.2, 50, 50)">
//             {/* The Core Jupiter Circle with the complex shadow filter */}
//             <circle
//               cx="50"
//               cy="50"
//               r="50"
//               fill={`url(#${groundPattern})`}
//               filter="url(#complex-inset-shadow)"
//             />

//             {/* Overlay Gradient to give it a spherical/hot edge look */}
//             <circle
//               cx="50"
//               cy="50"
//               r="50"
//               fill={`url(#${atmosphereGradient})`}
//               mask={`url(#${atmosphereMask})`}
//               pointerEvents="none"
//             />

//             <circle
//               cx="35"
//               cy="35"
//               r="20"
//               fill="rgba(255, 255, 255, .6)"
//               filter="url(#glare-blur-filter)"
//             />
//           </g>
//           <defs>
//             {/* Filters */}
//             <Filter id={FISHEYE_ID} />
//             <filter
//               id="glare-blur-filter"
//               x="-100%"
//               y="-100%"
//               width="300%"
//               height="300%"
//             >
//               <feGaussianBlur stdDeviation="10" />
//             </filter>

//             {/* Complex Inset Shadow Filter */}
//             <filter
//               id="complex-inset-shadow"
//               x="-50%"
//               y="-50%"
//               width="200%"
//               height="200%"
//             >
//               {/* Base source for shadows */}
//               <feFlood
//                 flood-color="#c3f4ff"
//                 flood-opacity="0"
//                 result="shadowSource"
//               />

//               {/* Outer white glow */}
//               <feDropShadow
//                 dx="0"
//                 dy="0"
//                 stdDeviation="0.1"
//                 flood-color="white"
//                 flood-opacity="0.2"
//               />

//               {/* First inner light blue glow */}
//               <feFlood flood-color="#c3f4ff" result="color1" />
//               <feComposite in2="SourceAlpha" operator="out" result="comp1" />
//               <feGaussianBlur in="comp1" stdDeviation="0.4" result="blur1" />
//               <feOffset dx="-0.05" dy="0" result="offset1" />
//               <feComposite
//                 operator="over"
//                 in="offset1"
//                 in2="SourceGraphic"
//                 result="compOver1"
//               />

//               {/* Second inner black shadow */}
//               <feFlood flood-color="black" result="color2" />
//               <feComposite in2="SourceAlpha" operator="out" result="comp2" />
//               <feGaussianBlur in="comp2" stdDeviation="1.25" result="blur2" />
//               <feOffset dx="1.5" dy="0.2" result="offset2" />
//               <feComposite
//                 operator="over"
//                 in="offset2"
//                 in2="SourceGraphic"
//                 result="compOver2"
//               />

//               {/* Third inner light blue glow with transparency */}
//               <feFlood
//                 floodColor="#c3f4ff"
//                 floodOpacity="0.6"
//                 result="color3"
//               />
//               <feComposite in2="SourceAlpha" operator="out" result="comp3" />
//               <feGaussianBlur in="comp3" stdDeviation="1.7" result="blur3" />
//               <feOffset dx="-2.4" dy="-0.2" result="offset3" />
//               <feComposite
//                 operator="over"
//                 in="offset3"
//                 in2="SourceGraphic"
//                 result="compOver3"
//               />

//               {/* Fourth large black inner shadow */}
//               <feFlood
//                 flood-color="black"
//                 flood-opacity="0.4"
//                 result="color4"
//               />
//               <feComposite in2="SourceAlpha" operator="out" result="comp4" />
//               <feGaussianBlur in="comp4" stdDeviation="2.2" result="blur4" />
//               <feOffset dx="25" dy="0" result="offset4" />
//               <feComposite
//                 operator="over"
//                 in="offset4"
//                 in2="SourceGraphic"
//                 result="compOver4"
//               />

//               {/* Fifth medium black inner shadow */}
//               <feFlood
//                 flood-color="black"
//                 flood-opacity="0.666"
//                 result="color5"
//               />
//               <feComposite in2="SourceAlpha" operator="out" result="comp5" />
//               <feGaussianBlur in="comp5" stdDeviation="1.9" result="blur5" />
//               <feOffset dx="15" dy="0" result="offset5" />
//               <feComposite
//                 operator="over"
//                 in="offset5"
//                 in2="SourceGraphic"
//                 result="compOver5"
//               />

//               <feMerge>
//                 <feMergeNode in="SourceGraphic" />
//                 <feMergeNode in="offset1" />
//                 <feMergeNode in="offset2" />
//                 <feMergeNode in="offset3" />
//                 <feMergeNode in="offset4" />
//                 <feMergeNode in="offset5" />
//               </feMerge>
//             </filter>

//             {/* Alternative Simplified Filter (often works better) */}
//             <filter
//               id="jupiter-shadow-simple"
//               x="-100%"
//               y="-100%"
//               width="300%"
//               height="300%"
//             >
//               <feDropShadow
//                 dx="0"
//                 dy="0"
//                 stdDeviation="0.1"
//                 flood-color="white"
//                 flood-opacity="0.2"
//               />

//               <feMorphology
//                 operator="dilate"
//                 radius="0.5"
//                 in="SourceAlpha"
//                 result="thicker"
//               />
//               <feGaussianBlur in="thicker" stdDeviation="1" result="blurred" />

//               <feFlood flood-color="#c3f4ff" result="blueGlow" />
//               <feComposite
//                 in="blueGlow"
//                 in2="blurred"
//                 operator="in"
//                 result="blueInner"
//               />
//               <feOffset dx="-0.5" dy="0" />

//               <feFlood flood-color="black" result="blackShadow" />
//               <feComposite
//                 in="blackShadow"
//                 in2="blurred"
//                 operator="in"
//                 result="blackInner"
//               />
//               <feOffset dx="1.5" dy="0.2" />

//               <feMerge>
//                 <feMergeNode in="blueInner" />
//                 <feMergeNode in="blackInner" />
//                 <feMergeNode in="SourceGraphic" />
//               </feMerge>
//             </filter>

//             <CircleMask
//               id={atmosphereMask}
//               x={-5}
//               y={-5}
//               width={110}
//               height={110}
//               r={55}
//               pattern={`url(#${atmosphereMaskGradient})`}
//             />

//             <radialGradient
//               id={atmosphereMaskGradient}
//               cx="50%"
//               cy="50%"
//               r="50%"
//               fx="50%"
//               fy="50%"
//             >
//               <stop offset="50%" stopColor="white" stopOpacity="0" />
//               <stop offset="90%" stopColor="white" stopOpacity="1" />
//               <stop offset="100%" stopColor="white" stopOpacity="0" />
//             </radialGradient>

//             <linearGradient
//               id={atmosphereGradient}
//               x1="0%"
//               y1="0%"
//               x2="0%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="rgb(248, 199, 117)" />
//               <stop offset="5%" stopColor="rgb(184, 160, 107)" />
//               <stop offset="10%" stopColor="rgb(164, 136, 83)" />
//               <stop offset="15%" stopColor="rgb(189, 163, 114)" />
//               <stop offset="20%" stopColor="rgb(156, 124, 82)" />
//               <stop offset="25%" stopColor="rgb(229, 226, 195)" />
//               <stop offset="30%" stopColor="rgb(189, 150, 96)" />
//               <stop offset="35%" stopColor="rgb(200, 220, 226)" />
//               <stop offset="40%" stopColor="rgb(123, 48, 0)" />
//               <stop offset="45%" stopColor="rgb(223, 174, 100)" />
//               <stop offset="55%" stopColor="rgb(221, 199, 109)" />
//               <stop offset="60%" stopColor="rgb(203, 167, 96)" />
//               <stop offset="65%" stopColor="rgb(208, 146, 83)" />
//               <stop offset="70%" stopColor="rgb(233, 249, 254)" />
//               <stop offset="75%" stopColor="rgb(214, 197, 151)" />
//               <stop offset="80%" stopColor="rgb(183, 151, 115)" />
//               <stop offset="85%" stopColor="rgb(183, 175, 160)" />
//               <stop offset="90%" stopColor="rgb(206, 204, 169)" />
//               <stop offset="95%" stopColor="rgb(165, 147, 90)" />
//               <stop offset="100%" stopColor="rgb(181, 160, 117)" />
//             </linearGradient>

//             <Pattern
//               id={groundPattern}
//               duration={60}
//               width={225.45}
//               to={225.45}
//               href="/static/textures/jupiter_4k.png"
//             />

//             <Pattern
//               id={cloudsPattern}
//               duration={35}
//               href="/static/textures/earth_cloud.png"
//             />
//           </defs>
//         </svg>
//       </JupiterWrapper>
//     </Root>
//   );
// }

// export default JupiterTest;

import { FISHEYE_ID } from "@/types/constants";
import { CircleMask, Filter, Pattern } from "@/utils/componentUtils";
import { styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

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
  // height: "100vh",
}));

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

  // width: "1em", // ← Use em for the base size
  // height: "1em", // ← Square base
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
  // webkit-backface-visibility": "hidden",
  // --- THE FIX ---
  // We create a pseudo-element that sits ON TOP of the SVG
  // "&::before": {
  //   content: '""',
  //   position: "absolute",
  //   inset: 0,
  //   borderRadius: "50%",
  //   // background: "#000",
  //   boxShadow: `
  //     0 0 0.2vmin rgba(255,255,255,0.2),
  //     -0.05vmin 0 0.8vmin #c3f4ff inset,
  //     1.5vmin 0.2vmin 2.5vmin #000 inset,
  //     -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
  //     25vmin 0 4.4vmin #00000066 inset,
  //     15vmin 0 3.8vmin #000000aa inset
  //   `,
  //   // zIndex: 1,
  //   pointerEvents: "none",
  // },

  "&::after": {
    content: '""',
    position: "absolute",
    // top: 0,
    // left: 0,
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    pointerEvents: "none", // Ensures you can still click/hover the planet underneath
    zIndex: 10, // Must be higher than the SVG's stacking context

    // Move your shadow here:
    // boxShadow: `
    //     0 0 0.2vmin rgba(255,255,255,0.2),
    //     -0.05vmin 0 0.7vmin rgba(195, 244, 255, 0.5) inset,
    //     1.5vmin 0.2vmin 2.5vmin #000 inset,
    //     -2.4vmin -0.2vmin 3.4vmin #c3f4ff99 inset,
    //     2.5vmin 0 4.4vmin #00000066 inset,
    //     5.5vmin 0 5.75vmin #000000aa inset
    //   `,
    // boxShadow: `
    //   0px 0 20px RGBA(255, 255, 255, 0.2),
    //   -5px 0px 8px #c3f4ff inset,
    //   15px 2px 25px #000 inset,
    //   -24px -2px 34px #c3f4ff99 inset,
    //   250px 0px 44px #00000066 inset,
    //   150px 0px 38px #000000aa inset
    //   `,

    /* Inner bright turquoise glow (closest to surface) */
    // boxShadow: `
    //     0 0 30px 10px rgba(0, 255, 255, 0.6),
    //     0 0 60px 20px rgba(135, 216, 255, 0.5),
    //     0 0 100px 40px rgba(173, 239, 255, 0.3),
    //     0 0 150px 60px rgba(200, 245, 255, 0.15)
    //   `,
    /* Optional: subtle inset shadow for planetary curvature/limb darkening */
    /* Remove or adjust if your base image already has strong contrast */
    /* box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.3), [the outer layers above]; */
    // filter: `drop-shadow(0 0 30px rgba(0, 255, 255, 0.6))
    // drop-shadow(0 0 60px rgba(135, 216, 255, 0.5))
    // drop-shadow(0 0 100px rgba(173, 239, 255, 0.3))`,
    // boxShadow: `
    //   /* 1. Outer Atmosphere (Halo) - subtle blue glow outside the planet */
    //   // 0 0 30px -5px rgba(64, 160, 255, 0.4),
    //   0 0 30px -5px rgb(70, 89, 181, 0.5),

    //   /* 2. Sunlit Surface Highlight - bright white/cyan hit on the left */
    //   // inset 10px 0 20px -5px rgba(200, 240, 255, 0.7),
    //   inset 10px 0 20px -5px rgb(61, 76, 169, 0.7),

    //   /* 3. Rayleigh Scattering - deeper blue atmosphere gradients */
    //   // inset 20px 0 50px 0px rgba(0, 100, 255, 0.5),
    //   inset 20px 0 50px 0px rgb(60, 75, 170, 0.5),

    //   /* 4. The Terminator - Deep shadow transition */
    //   inset -20px 0 80px 0px rgba(0,0,0,0.5),

    //   /* 5. Deep Space Night - Pure black fill on the far right */
    //   inset -50px 0 60px 20px rgba(0,0,0,0.7)
    // `,

    // Scaled version of your current px-based shadow
    // These em values are calibrated to closely match your px version at ~76.5vmin diameter
    // (assuming your px values looked good at that size on your screen)
    // boxShadow: `
    //   /* 1. Outer Atmosphere Halo - subtle blue glow outside */
    //   0 0 0.04em -0.006em rgb(70, 89, 181, 0.5),
    //   /* softer sky-blue halo */
    //   0 0 0.08em 0.02em rgba(135, 206, 255, 0.3),

    //   /* 2. Sunlit Surface Highlight - brighter blue/cyan on the left */
    //   inset 0.013em 0 0.026em -0.006em rgb(61, 76, 169, 0.7),

    //   /* 3. Rayleigh Scattering - deeper blue atmosphere */
    //   inset 0.026em 0 0.065em 0 rgb(60, 75, 170, 0.5),

    //   /* 4. Terminator Transition - soft dark edge */
    //   inset -0.026em 0 0.105em 0 rgba(0,0,0,0.5),

    //   /* 5. Deep Night Side - strong black shadow on the right */
    //   inset -0.065em 0 0.078em 0.026em rgba(0,0,0,0.7)
    // `,

    // 3. SCALABLE SHADOWS (converted px to em)
    // Ratios based on 1em = Container Size (approx 1.17x Planet Diameter)
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

    // NASA-PERFECT SCALABLE SHADOWS
    // boxShadow: `
    //   /* Outer atmosphere glow */
    //   0 0
    //     calc(4px * var(--size-factor))
    //     calc(-1.5px * var(--size-factor))
    //     rgba(70, 89, 181, 0.55),

    //   /* Sunlit highlight */
    //   inset
    //     calc(2.2px * var(--size-factor)) 0
    //     calc(5px * var(--size-factor))
    //     calc(-1.8px * var(--size-factor))
    //     rgba(61, 76, 169, 0.75),

    //   /* Atmospheric scattering */
    //   inset
    //     calc(4.5px * var(--size-factor)) 0
    //     calc(11px * var(--size-factor))
    //     calc(-0.5px * var(--size-factor))
    //     rgba(60, 75, 170, 0.55),

    //   /* Terminator shadow */
    //   inset
    //     calc(-4.8px * var(--size-factor)) 0
    //     calc(18px * var(--size-factor))
    //     rgba(0, 0, 0, 0.6),

    //   /* Night side fill */
    //   inset
    //     calc(-11.5px * var(--size-factor)) 0
    //     calc(14px * var(--size-factor))
    //     calc(4.2px * var(--size-factor))
    //     rgba(0, 0, 0, 0.8)
    // `,
  },

  // "& > svg": {
  //   position: "relative",
  //   zIndex: 2,
  //   width: "100%",
  //   height: "100%",
  // },
}));

const lightMask = `${PREFIX}-light-mask`;
const waterMask = `${PREFIX}-water-mask`;
const groundMask = `${PREFIX}-ground-mask`;
const cloudsMask = `${PREFIX}-clouds-mask`;
const atmosphereMask = `${PREFIX}-atmosphere-mask`;
const atmosphereGradient = `${PREFIX}-atmosphere-gradient`;
const atmosphereMaskGradient = `${PREFIX}-atmosphere-mask-gradient`;
const lightFilter = `${PREFIX}-light-filter`;
const groundPattern = `${PREFIX}-ground-pattern`;
const cloudsPattern = `${PREFIX}-clouds-pattern`;

function TestPlanet({ size = 90 }: { size?: number }) {
  const sizeFactor = size / 90;

  return (
    <Root size={size}>
      <EarthWrapper sizeFactor={sizeFactor}>
        <svg id="earth" viewBox="-0.5 -0.5 101 101" width="100%" height="100%">
          <g transform="rotate(23.5, 50, 50)">
            {" "}
            {/* Your existing rotation */}
            {/* ... water layer remains the same ... */}
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              // fill="rgba(0, 0, 200, 1)"
              fill="url(#oceanGrad)"
              mask={`url(#${waterMask})`}
            />
            {/* REALISTIC SPHERICAL GROUND LAYER */}
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="url(#earthSurface)"
              mask={`url(#${groundMask})`}
              filter="url(#spherical-distortion)"
            />
            {/* ... clouds layer remains the same ... */}
            {/* <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="rgba(255, 255, 255,1)"
              mask={`url(#${cloudsMask})`}
            /> */}
            {/* REALISTIC LIGHTING (MATCHES NASA SUN ANGLE) */}
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="url(#spherical-lighting)"
              // mask={`url(#${groundMask})`}
              opacity="0.25"
            />
            {/* ... atmosphere and glare remain the same ... */}
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
            {/* ... your existing filters and masks ... */}
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
            {/* --- NEW SUN LIGHTING FILTER --- 
              This uses feSpecularLighting with a fePointLight.
              It creates a bright "shiny" spot in the center (50,50) 
              that mimics direct overhead sunlight.
            */}
            <filter
              id={lightFilter}
              // x="-50%"
              // y="-50%"
              // width="200%"
              // height="200%"
            >
              {/* 1. Define the lens map using feImage with a Data URI. 
                This is a radial gradient: White center (displacement) 
                -> Black edge (no displacement).
              */}
              {/* <feImage
                href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fff'/%3E%3Cstop offset='100%25' stop-color='%23000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3C/svg%3E"
                result="lens"
              /> */}

              {/* 2. Apply the displacement. 
              scale="25": How strong the 'bulge' is.
              xChannelSelector="R": Use the Red channel of the lens to shift pixels horizontally.
              yChannelSelector="G": Use Green channel for vertical. 
              Since our lens is grayscale, R=G, so it shifts diagonally outward from the dark edges.
            */}

              {/* 1. feGaussianBlur: Optional, slightly softens the input before lighting 
                     to avoid sharp pixel artifacts on the light map.
              */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />

              <feDisplacementMap in="SourceGraphic" in2="blur" scale="3" />
              {/* <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale="25"
                xChannelSelector="R"
                yChannelSelector="G"
              /> */}

              {/* 2. feSpecularLighting: Creates the shiny highlight.
                     - specularConstant: Intensity of the light (1.2 is bright)
                     - specularExponent: Sharpness of the spot (lower = broader soft light, higher = sharp tiny spot)
                     - lighting-color: The color of the sun (slightly warm white)
              */}
              <feSpecularLighting
                in="SourceAlpha"
                result="specOut"
                specularConstant="1.5"
                specularExponent="25"
                // lightingColor="#ffffee"
                lightingColor="$#FFFFFF"
              >
                {/* fePointLight: The bulb.
                    x, y: 50, 50 places it in the dead center.
                    z: The height above the screen. Lower Z = more intense, smaller spot. Higher Z = softer, wider spread.
                */}
                <fePointLight x="15" y="50" z="25" />
              </feSpecularLighting>

              {/* 3. feComposite: Blends the shiny highlight ON TOP of the original image.
                     operator="arithmetic" k1=0, k2=1, k3=1, k4=0
                     Formula: Result = k1*in1*in2 + k2*in1 + k3*in2 + k4
                     So: (Original Image * 1) + (Light Map * 1) -> Additive blending
              */}
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
            {/* // --- NEW FISHEYE FILTER --- // 
            This creates a "lens" distortion map using a radial gradient. 
            When applied to the sliding texture, it magnifies the center and compresses the edges, 
            simulating spherical rotation. This gives the illusion of a 3D sphere rotating,
            spherical rotation. */}
            <filter
              id={FISHEYE_ID + "lala"}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              {/* 1. Define the lens map using feImage with a Data URI. 
                This is a radial gradient: White center (displacement) 
                -> Black edge (no displacement).
              */}
              <feImage
                href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23fff'/%3E%3Cstop offset='100%25' stop-color='%23000'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3C/svg%3E"
                result="lens"
              />

              {/* 2. Apply the displacement. 
              scale="25": How strong the 'bulge' is.
              xChannelSelector="R": Use the Red channel of the lens to shift pixels horizontally.
              yChannelSelector="G": Use Green channel for vertical. 
              Since our lens is grayscale, R=G, so it shifts diagonally outward from the dark edges.
            */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="lens"
                scale="25"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            {/* SPHERICAL PROJECTION FILTER */}
            <filter
              id="spherical-distortion"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />{" "}
              {/* Reduced from 10 */}
              {/* NASA-optimized distortion curve */}
              <feComponentTransfer in="blur" result="distortion-map">
                <feFuncA
                  type="table"
                  tableValues="0 0 0 0.05 0.15 0.3 0.5 0.7 0.85 0.95 1"
                />
              </feComponentTransfer>
              {/* Perfect scale for NASA texture */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="distortion-map"
                scale="18"
                xChannelSelector="A"
                yChannelSelector="A"
              />
              <feComposite in="SourceGraphic" in2="Result" operator="in" />
              {/* Critical: Add atmospheric limb enhancement */}
              <feComponentTransfer>
                <feFuncR type="gamma" amplitude="1.1" exponent="0.9" />
                <feFuncG type="gamma" amplitude="1.1" exponent="0.9" />
                <feFuncB type="gamma" amplitude="1.2" exponent="0.85" />
              </feComponentTransfer>
            </filter>
            {/* REALISTIC SUNLIGHT GRADIENT */}

            <radialGradient id="spherical-lighting" cx="42%" cy="48%" r="110%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="65%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="85%">
              {/* <stop offset="0%" stopColor="rgb(30, 64, 175)" /> */}
              {/* Deep Blue */}
              {/* <stop offset="100%" stopColor="rgb(15, 23, 42)" /> */}
              {/* Dark Space Blue */}
              <stop offset="0%" stopColor="rgb(1, 1, 35)" />
              <stop offset="50%" stopColor="rgb(5, 5, 55)" />
              <stop offset="65%" stopColor="rgb(16, 17, 73)" />

              {/* Deep Blue */}
              <stop offset="85%" stopColor="rgb(14, 20, 84)" />
              {/* <stop offset="100%" stopColor="rgb(42, 53, 132)" /> */}
              <stop offset="100%" stopColor="rgb(24, 31, 99)" />
              {/* Dark Space Blue */}
            </radialGradient>
            {/* Atmosphere */}
            <linearGradient
              id={atmosphereGradient}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {/* <stop offset="0%" stopColor="rgb(0,127,255)" stopOpacity="1" />
                          <stop offset="100%" stopColor="rgb(0,0,255)" stopOpacity=".5" /> */}
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
            <CircleMask
              id={waterMask}
              pattern="white"
              // fill="white"
              // filterId={lightFilter}
            />
            <CircleMask
              id={groundMask}
              pattern={`url(#${groundPattern})`}
              fill="white"
              filterId={lightFilter}
            />
            <CircleMask
              id={cloudsMask}
              pattern={`url(#${cloudsPattern})`}
              // fill="white"
              // filterId={lightFilter}
            />
            <Pattern
              id={groundPattern}
              duration={50}
              width={179.8}
              to={179.8}
              // patternUnits={"objectBoundingBox"}
              href="/static/textures/earth.svg"
            />
            {/* <Pattern
              id={"earthSurface"}
              duration={50}
              width={179.8}
              to={179.8}
              href="/static/textures/earth_pattern.png"
            /> */}
            {/* // Replace your current earthSurface pattern with this EXACT */}
            {/* implementation */}
            <Pattern
              id="earthSurface"
              duration={50}
              width={200}
              to={200}
              href="https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/july/world.topo.bathy.200407.3x21600x10800.jpg"
              // preserveAspectRatio="none"
            />
            <Pattern
              id={cloudsPattern}
              duration={45}
              // to={-200}
              href="/static/textures/earth_cloud.png"
            />
          </defs>
        </svg>
      </EarthWrapper>
    </Root>
  );
}

export default TestPlanet;
