import { Theme } from "@mui/material/styles";
import { IEvents, IModes, ISourceOptions } from "@tsparticles/engine";

// interface ParticleOptions {
//   theme?: Theme;
//   modes?: IModes;
//   events?: IEvents;
// }
const options = ({
  theme,
  modes = {
    grab: {
      distance: 125,
      links: {
        opacity: 0.5,
        color: "#FFF",
      },
    },
  },
  events = {
    onHover: {
      enable: true,
      mode: "grab",
      parallax: { enable: false, force: 60, smooth: 10 },
    },
  },
}: {
  theme?: Theme;
  modes?: Partial<IModes>;
  events?: Partial<IEvents>;
}): ISourceOptions => {
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
  console.log("Particle options generated with theme:", theme);

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
      color: { value: theme ? theme.palette.primary.main : "#FFF" },
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
      number: {
        value: 30,
      },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 3 } },
    },
  };
};

export default options;
