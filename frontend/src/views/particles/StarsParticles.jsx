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
      random: true,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 85,
    },
    opacity: {
      value: 0.3,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 0.5, max: 3 },
      anim: {
        enable: true,
        speed: 4,
        size_min: 0.3,
        sync: false,
      },
    },
  },
};

export { initEngine, starsOptions };
