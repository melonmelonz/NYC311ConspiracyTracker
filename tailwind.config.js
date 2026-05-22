/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', '"Anton"', '"Oswald"', "sans-serif"],
        body: ["Inter", '"Roboto Condensed"', "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        marker: ["Caveat", '"Permanent Marker"', "cursive"],
      },
      colors: {
        matte: "#0a0a0a",
        charcoal: "#111111",
        gunmetal: "#1a1a1a",
        paper: "#b8a98f",
        dirty: "#8f8068",
        blood: "#8b0000",
        crimson: "#c1121f",
        burnt: "#7f1d1d",
        rust: "#b6461b",
        surveillance: "#00ff88",
        hacker: "#00d26a",
        violet: "#9d4edd",
        alien: "#3a86ff",
        aged: "#d9d2c5",
        muted: "#8c8c8c",
      },
      boxShadow: {
        evidence:
          "0 26px 80px rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(184,169,143,0.12)",
        crimson: "0 0 22px rgba(193, 18, 31, 0.35)",
        terminal: "0 0 28px rgba(0, 255, 136, 0.18)",
      },
      animation: {
        flicker: "flicker 4s infinite",
        pulseHotspot: "pulseHotspot 2.2s ease-in-out infinite",
        slideIn: "slideIn 420ms ease-out both",
      },
    },
  },
  plugins: [],
};
