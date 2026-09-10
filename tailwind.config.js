// tailwind.config.js - Yaalu Rider App custom theme
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Yaalu brand colors
        yaalu: {
          yellow: '#FFC72C',
          navy: '#0B1044',
          dark: '#07092E',
        },
      },
    },
  },
  plugins: [],
};
