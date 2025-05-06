// Initialize particles.js
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#d8a92b",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
  retina_detect: true,
});

window.addEventListener("DOMContentLoaded", () => {
  const promoText = document.querySelector(".promo-text");
  const banner = document.querySelector(".promo-banner");
  const baseText =
    "SITE LAUNCH PROMOTION \u00A0 \u00A0 \u00A0 \u00A0\u00A0\u00A0\u00A0";

  let repeatedText = baseText;

  // Keep adding baseText until it's at least twice the width of the banner
  while (getTextWidth(repeatedText, promoText) < banner.offsetWidth * 2) {
    repeatedText += baseText;
  }

  promoText.textContent = repeatedText;

  // Calculate speed based on the banner width (slower for longer text)
  const speedFactor = banner.offsetWidth / 100; // Adjust the 1000 factor for desired speed

  // Set the speed in the CSS animation dynamically
  promoText.style.animationDuration = `${speedFactor}s`; // Dynamically set speed
});

function getTextWidth(text, element) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const style = getComputedStyle(element);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.font = font;
  return context.measureText(text).width;
}
