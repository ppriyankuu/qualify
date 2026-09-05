import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: "#F4F0EA",
          surface: "#FFFFFF",
          border: "#000000",
          pink: "#FF90E8",
          yellow: "#FFC900",
          green: "#05F140",
          mint: "#23A094",
          red: "#FF6B6B",
          blue: "#70D6FF",
          purple: "#D4A5FF",
          orange: "#FF8C42",
          muted: "#E5E0D8",
          subtle: "#71717A",
        },
      },
      boxShadow: {
        "neo-sm": "2px 2px 0px 0px #000000",
        neo: "4px 4px 0px 0px #000000",
        "neo-lg": "6px 6px 0px 0px #000000",
        "neo-xl": "8px 8px 0px 0px #000000",
        "neo-hover": "5px 5px 0px 0px #000000",
        "neo-inner": "inset 2px 2px 0px 0px #000000",
      },
      borderWidth: {
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
