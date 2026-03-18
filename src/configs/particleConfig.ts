import { de } from "date-fns/locale";

const options = {
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
    events: {
      onHover: { enable: true, mode: "grab" },
    },
    modes: {
      grab: { distance: 125, links: { opacity: 0.5 } },
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      color: "#ffffff",
      distance: 125,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
    },
    number: {
      value: 30,
    },
    opacity: { value: 0.5 },
    size: { value: { min: 1, max: 3 } },
  },
};

export default options;
