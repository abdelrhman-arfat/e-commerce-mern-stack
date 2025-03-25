import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        love: "#e50000",
        zero: "#fdfdfd",
        one: "#90caf9",
        two: "#64b5f6",
        three: "#42a5f5",
        four: "#2196f3",
        five: "#00a8e8",
        six: "#1e88e5",
        seven: "#1565c0",
        eight: "#0d47a1",
        nine: "#003459",
        ten: "#00171f",
      },
    },
  },
  plugins: [],
} satisfies Config;
