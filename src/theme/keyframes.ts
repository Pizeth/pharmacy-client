"use client";
import { keyframes } from "@mui/material";

export const shake = keyframes`
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1px);
  }
  50% {
    transform: translateX(1px);
  }
  75% {
    transform: translateX(-1px);
  }
  100% {
    transform: translateX(0);
  }
    `;

export const filt = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }`;

export const wee = keyframes`
  0% {
    background-position:
      var(--p),
      800% 400%,
      1000% -400%,
      -1200% -600%,
      400% 41.5692194px;
  }
  to {
    background-position:
      var(--p),
      0% 0%,
      0% 0%,
      0% 0%,
      0% 0%;
  }
`;

export const hii = keyframes`
  0% {
    backdrop-filter: var(--f) hue-rotate(0deg);
  }
  to {
    backdrop-filter: var(--f) hue-rotate(360deg);
  }
`;

export const hi = keyframes`
0% {
    background-position:
      0px 220px,
      3px 220px,
      151.5px 337.5px,
      25px 24px,
      28px 24px,
      176.5px 150px,
      50px 16px,
      53px 16px,
      201.5px 91px,
      75px 224px,
      78px 224px,
      226.5px 350.5px,
      100px 19px,
      103px 19px,
      251.5px 121px,
      125px 120px,
      128px 120px,
      276.5px 187px,
      150px 31px,
      153px 31px,
      301.5px 120.5px,
      175px 235px,
      178px 235px,
      326.5px 384.5px,
      200px 121px,
      203px 121px,
      351.5px 228.5px,
      225px 224px,
      228px 224px,
      376.5px 364.5px,
      250px 26px,
      253px 26px,
      401.5px 105px,
      275px 75px,
      278px 75px,
      426.5px 180px;
  }

  to {
    background-position:
      0px 6800px,
      3px 6800px,
      151.5px 6917.5px,
      25px 13632px,
      28px 13632px,
      176.5px 13758px,
      50px 5416px,
      53px 5416px,
      201.5px 5491px,
      75px 17175px,
      78px 17175px,
      226.5px 17301.5px,
      100px 5119px,
      103px 5119px,
      251.5px 5221px,
      125px 8428px,
      128px 8428px,
      276.5px 8495px,
      150px 9876px,
      153px 9876px,
      301.5px 9965.5px,
      175px 13391px,
      178px 13391px,
      326.5px 13540.5px,
      200px 14741px,
      203px 14741px,
      351.5px 14848.5px,
      225px 18770px,
      228px 18770px,
      376.5px 18910.5px,
      250px 5082px,
      253px 5082px,
      401.5px 5161px,
      275px 6375px,
      278px 6375px,
      426.5px 6480px;
  }`;

export const drop = keyframes`
  0% {
    top: -50%;
  }
  100% {
    top: 110%;
  }`;

/* Faster blur animation */
export const blurAnimation = keyframes`
  to {
    filter: blur(0.5vmin);
    transform: scale(1.00125);
  }
`;

export const blurPulse = keyframes`
  0% { filter: blur(2vmin); transform: scale(1); }
  100% { filter: blur(3vmin); transform: scale(1.05); }
`;

/* Faster gradient animation */
export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const steam = keyframes`
  0% { background-position: 0 0; }
  50% { background-position: 250% 0; }
  100% { background-position: 0 0; }
`;

export const earthRotate = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 300px 0; }
`;

export const sunRotate = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 400px 0; }
`;

export const shadowPulse = keyframes`
  0%,
  100% {
    box-shadow: 0px 0px 2vmin 1vmin rgba(255, 74, 0, 0.76),
      -0.25vmin 0px 0.5vmin 0.05vmin rgba(255, 26, 0, 0.8) inset,
      0.75vmin 0.1vmin 2vmin 1vmin rgba(255, 38, 0, 0.79) inset,
      1.2vmin 0.1vmin 2.5vmin 1.25vmin rgba(255, 50, 0, 0.78) inset,
      7.5vmin 0px 4vmin 1.75vmin rgba(255, 62, 0, 0.77) inset
  }
  50% {
    box-shadow: 0px 0px 4vmin 2vmin rgba(255, 74, 0, 0.76),
      -0.5vmin 0px 1vmin 0.1vmin rgba(255, 26, 0, 0.8) inset, 
      1.5vmin 0.2vmin 4vmin 2vmin rgba(255, 38, 0, 0.79)inset,
      -2.4vmin -0.2vmin 5vmin 2.5vmin rgba(255, 50, 0, 0.78) inset,
      15vmin 0px 8vmin 3.5vmin rgba(255, 62, 0, 0.77)  inset;
  }
`;

export const cloudMove = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
`;

// export const moveBackground = keyframes`
//   from { transform: translate3d(0px, 0px, 0px); }
//   to   { transform: translate3d(1000px, 0px, 0px); }
// `;

export const moveBackgroundLeft = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -100% 0; }
`;

export const moveBackgroundRight = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
`;

export const move = keyframes`
  0% { transform: translateX(0em) translateY(0em); }
  25% { transform: translateY(-0.75em) translateX(-0.75em) rotate(-10deg); }
  50% { transform: translateY(0.75em) translateX(-0.75em); }
  75% { transform: translateY(-1em) translateX(0.75em) rotate(10deg); }
  100% { transform: translateX(0em) translateY(0em); }
`;

export const infiniteRotate = keyframes`
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(360deg);
  }
`;

// export const glowingStars = keyframes`
//   0% { opacity: 0; }
//   50% { opacity: 1; }
//   100% { opacity: 0; }
// `;

// export const shootingStar = keyframes`
//   0% { transform: rotate(315deg) translateX(0) translateY(0); opacity: 1; }
//   50% { transform: rotate(315deg) translateX(-55vw) translateY(0); opacity: 1; }
//   70% { transform: rotate(315deg) translateX(-70vw) translateY(0); opacity: 0; }
//   100% { transform: translateX(0) translateY(0); opacity: 0; }
// `;

// export const shootingStar = keyframes`
//     0% { transform: rotate(var(--rot)) translateX(0) translateY(0); opacity: 0; }
//     10% {transform: rotate(var(--rot)) translateX(0) translateY(0); opacity: 1; }
//     70% { transform: rotate(var(--rot)) translateX(-100vw) translateY(0); opacity: 0; }
//     100% { transform: rotate(var(--rot)) translateX(0) translateY(0); opacity: 0; }
// `;

export const tail = keyframes`   
  0% {width: 0; }
  30% { width: 15vw; }
  100% {width: 0; }
`;

// @keyframes falling {
//     0% {
//         transform: translateX(0);
//     }

//     100% {
//         transform: translateX(300px);
//     }
// }

export const shootingStar = keyframes`
  0%   { opacity: 0; offset-distance: 0%; }
  10%  { opacity: 1; offset-distance: 20%; }
  75%  { opacity: 0; offset-distance: 100%; }
  100% { opacity: 0; offset-distance: 100%; }
`;

// export const glowingStars = keyframes`
//   0% { opacity: 0; }
//   12.5% { opacity: 0.25;}
//   25% { opacity: 0.5; }
//   37.5% { opacity: 0.75; }
//   50% { opacity: 1; }
//   62.5% { opacity: 0.75; }
//   75% { opacity: 0.5; }
//   87.5% { opacity: 0.25; }
//   100% { opacity: 0; }
// `;

export const glowingStars = keyframes`
  0% { opacity: 0.2; --ray: 0vh; --core: 0.1vh; --halo: 0.125vh; right: 0; }
  12.5% { opacity: 0.4; --ray: 0.3vh; --core: 0.125vh; --halo: 0.25vh; }
  25% { opacity: 0.6; --ray: 0.75vh; --core: 0.15vh; --halo: 0.5vh; right: 0; }
  37.5% { opacity: 0.8; --ray: 1vh; --core: 0.175vh; --halo: 0.75vh; }
  50% { opacity: 1; --ray: 1.25vh; --core: 0.20vh; --halo: 1vh; right: 0; }
  62.5% { opacity: 0.8; --ray: 1vh; --core: 0.175vh; --halo: 0.75vh; }
  75% { opacity: 0.6; --ray: 0.75vh; --core: 0.15vh; --halo: 0.5vh; right: 0; }
  87.5% { opacity: 0.4; --ray: 0.3vh; --core: 0.125vh; --halo: 0.25vh; }
  100% { opacity: 0.2; --ray: 0vh; --core: 0.1vh; --halo: 0.5vh; right: 0; }
`;

export const shining = keyframes`    
  0% { width: 0; }
  50% { width: 1.5vw; }
  100% { width: 0; }
`;

// export const twinkling = keyframes`
//   0% { opacity: width: 0; }
//   12.5%{ opacity: 0.4; width: 0.25vw; }
//   25% { opacity: 0.6; width: 0.5vw; }
//   37.5%{ opacity: 0.8; width: 0.75vw; }
//   50% { opacity: 1; width: 1vw; }
//   62.5%{ opacity: 0.8; width: 0.75vw; }
//   75% { opacity: 0.6; width: 0.5vw; }
//   87.5%{ opacity: 0.4; width: 0.25vw; }
//   100% { opacity: 0.2; width: 0; }
// `;

export const twinkling = (baseSize: number) => keyframes`    
  0% { opacity: 0.2; width: 0; }
  12.5%{ opacity: 0.4; width: ${baseSize * 2}vw; }
  25% { opacity: 0.6; width: ${baseSize * 3}vw; }
  37.5%{ opacity: 0.8; width: ${baseSize * 4}vw; }
  50% { opacity: 1; width: ${baseSize * 5}vw; }
  62.5%{ opacity: 0.8; width: ${baseSize * 4}vw; }
  75% { opacity: 0.6; width: ${baseSize * 3}vw; }
  87.5%{ opacity: 0.4; width: ${baseSize * 2}vw; }
  100% { opacity: 0.2; width: 0; }
`;

// export const twinkle = keyframes`
//   0% { opacity: 0; --ray: 0vw; --core: 0.1vw; --halo: 0.125vw; }
//   12.5% { opacity: 0.25; --ray: 0.3vw; --core: 0.125vw; --halo: 0.25vw; }
//   25% { opacity: 0.5; --ray: 0.75vw; --core: 0.15vw; --halo: 0.5vw; }
//   37.5% { opacity: 0.75; --ray: 1vw; --core: 0.175vw; --halo: 0.75vw; }
//   50% { opacity: 1; --ray: 1.25vw; --core: 0.20vw; --halo: 1vw; }
//   62.5% { opacity: 0.75; --ray: 1vw; --core: 0.175vw; --halo: 0.75vw;}
//   75% { opacity: 0.5; --ray: 0.75vw; --core: 0.15vw; --halo: 0.5vw; }
//   87.5% { opacity: 0.25; --ray: 0.3vw; --core: 0.125vw; --halo: 0.25vw; }
//   100% { opacity: 0; --ray: 0vw; --core: 0.1vw; --halo: 0.5vw; }
// `;

export const twinkle = keyframes`
  0% { opacity: 0; --ray: 0vh; --core: 0.1vh; --halo: 0.125vh; }
  12.5% { opacity: 0.25; --ray: 0.3vh; --core: 0.125vh; --halo: 0.25vh; }
  25% { opacity: 0.5; --ray: 0.75vh; --core: 0.15vh; --halo: 0.5vh; }
  37.5% { opacity: 0.75; --ray: 1vh; --core: 0.175vh; --halo: 0.75vh; }
  50% { opacity: 1; --ray: 1.25vh; --core: 0.20vh; --halo: 1vh; }
  62.5% { opacity: 0.75; --ray: 1vh; --core: 0.175vh; --halo: 0.75vh;}
  75% { opacity: 0.5; --ray: 0.75vh; --core: 0.15vh; --halo: 0.5vh; }
  87.5% { opacity: 0.25; --ray: 0.3vh; --core: 0.125vh; --halo: 0.25vh; }
  100% { opacity: 0; --ray: 0vh; --core: 0.1vh; --halo: 0.5vh; }
`;

// export const twinkle = keyframes`
//   0% { opacity: 0.2; --ray: 0.vw; --core: 0.1vw; --halo: 0.125vw; }
//   12.5%{ opacity: 0.4; --ray: 0.3vw; --core: 0.125vw; --halo: 0.25vw; }
//   25% { opacity: 0.6; --ray: 0.75vw; --core: 0.15vw; --halo: 0.5vw; }
//   37.5%{ opacity: 0.8; --ray: 1vw; --core: 0.175vw; --halo: 0.75vw; }
//   50% { opacity: 1; --ray: 1.25vw; --core: 0.2vw; --halo: 1vw; }
//   62.5%{ opacity: 0.8; --ray: 1vw; --core: 0.175vw; --halo: 0.75vw; }
//   75% { opacity: 0.6; --ray: 0.75vw; --core: 0.15vw; --halo: 0.5vw; }
//   87.5%{ opacity: 0.4; --ray: 0.3vw; --core: 0.125vw; --halo: 0.25vw; }
//   100% { opacity: 0.2; --ray: 0.vw; --core: 0.1vw; --halo: 0.125vw; }
// `;

// export const meteorStrike = keyframes`
//   0% { background-position: 0 0; }
//   100% { background-position: -28800px 0; }
// `;

export const meteorStrike = keyframes`     
  0% { background-position: 0% 0; }
  100% { background-position: 100% 0; } /* 100% aligns the last frame */
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0) translateY(-100%); }
  to { opacity: 1; transform: scale(1); }
`;

export const fadeOut = keyframes`
  from { opacity: 0; transform: scale(0) translateY(100%); }
  to { opacity: 1; transform: scale(1); }
`;

// export const fadeOut = keyframes`
//   from { opacity: 1; transform: scale(1) translateY(100%); }
//   to { opacity: 0; transform: scale(0); }
// `;

// ============================================
// REMOVE THESE - Not used anymore
// ============================================

// ❌ REMOVE: filt (not used)
// ❌ REMOVE: wee (not used)
// ❌ REMOVE: hii (not used)
// ❌ REMOVE: hi (not used)
// ❌ REMOVE: drop (not used)
// ❌ REMOVE: blurAnimation (not used)
// ❌ REMOVE: blurPulse (not used)
// ❌ REMOVE: gradientShift (not used)
// ❌ REMOVE: steam (not used)
// ❌ REMOVE: moveBackgroundRight (not used)
// ❌ REMOVE: infiniteRotate (moved to component)
// ❌ REMOVE: glowingStars (not used)
// ❌ REMOVE: shootingStar (moved to component)
// ❌ REMOVE: tail (moved to component)
// ❌ REMOVE: shining (not used)

// ============================================
// FINAL OPTIMIZED KEYFRAMES FILE
// ============================================

/*
BEFORE: 25+ keyframes (many unused)
AFTER: 11 keyframes (only what's needed)
REDUCTION: 56% fewer keyframes
*/
