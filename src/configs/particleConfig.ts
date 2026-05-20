import { Theme } from "@mui/material/styles";
import { ISourceOptions } from "@tsparticles/engine";

// interface ParticleOptions {
//   theme?: Theme;
//   modes?: IModes;
//   events?: IEvents;
// }
const options = (
  theme?: Theme,
  // modes: Partial<IModes> = {
  modes: Record<string, unknown> = {
    grab: {
      distance: 125,
      links: {
        opacity: 0.5,
        color: "#FFF",
      },
    },
  },
  events: Record<string, unknown> = {
    onHover: {
      enable: true,
      mode: "grab",
      parallax: { enable: false, force: 60, smooth: 10 },
    },
  },
  number = 30,
  shape = "circle",
): ISourceOptions => {
  // const {
  //   theme,
  //   modes = {
  //     grab: {
  //       distance: 125,
  //       links: {
  //         opacity: 0.5,
  //         color: theme ? theme.palette.primary.main : "#FFF",
  //       },
  //     },
  //   },
  //   events = {
  //     onHover: { enable: true, modes: "grab" },
  //   },
  // } = options;
  // console.log("Particle options generated with theme:", theme);

  return {
    fullScreen: { enable: false }, // Crucial: prevents it from covering the whole page
    style: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    },
    fpsLimit: 120,
    interactivity: {
      events,
      modes,
    },
    particles: {
      // color: { value: theme ? theme.palette.primary.main : "#FFF" },
      paint: {
        fill: {
          // value: theme ? theme.palette.primary.main : "#FFF",
          color: { value: theme ? theme.palette.primary.main : "#FFF" },
          enable: true,
        },
        stroke: {
          width: 1,
          color: { value: "#000000" },
          opacity: 0.25,
        },
      },
      links: {
        color: theme ? theme.palette.primary.main : "#FFF",
        distance: 125,
        enable: true,
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        outModes: "out",
      },
      repulse: {
        value: 0,
        enabled: false,
        distance: 200,
        duration: 0.25,
      },
      number: {
        value: number,
      },
      opacity: { value: 0.5 },
      shape: { type: shape },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
    // preset: "triangles",
  };
};

export default options;
