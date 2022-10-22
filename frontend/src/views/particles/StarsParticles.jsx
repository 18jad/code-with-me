import { loadStarsPreset } from "tsparticles-preset-stars";

// Init particles engine
const initEngine = async (engine) => {
  await loadStarsPreset(engine);
};

// Particles engine options
const starsOptions = {
  preset: "stars",
  fullScreen: { enable: false },
  background: {
    color: {
      value: "invinsible",
    },
  },
  particles: {
    color: {
      value: "#ffffff", // stars color
    },
    collisions: {
      enable: true,
    },
    move: {
      directions: "none",
      enable: true,
      random: false,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 70,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 0.5, max: 3 },
    },
  },
};

export { initEngine, starsOptions };
