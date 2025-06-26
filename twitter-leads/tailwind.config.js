/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // looks inside all files in /src for classes
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark-light-dark': 'linear-gradient( #0f0f0f,#1d1d1d, #0f0f0f)',
      },
    },
  },
  plugins: [],
}

