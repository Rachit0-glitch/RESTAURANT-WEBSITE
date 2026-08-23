import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        "16/9": "16 / 9",
      },
    },
  },
  plugins: [],
};

export default config;
