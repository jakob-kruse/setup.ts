module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "business"],
    lightTheme: 'light',
    darkTheme: "business",
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
