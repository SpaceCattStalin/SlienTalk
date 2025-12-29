/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F1FF', // lightest
          200: '#7CAAF7', // hover
          400: '#2877ED', // base
          600: '#2463C9', // pressed
          800: '#0B3478', // dark
        },
        success: '#4DED35',
        error: '#CA3D3D',
        // accent: '#F4D2B8',
        // primary: '#030014',
        // secondary: '#151312',
        // light: {
        //   100: '#D6C6FF',
        //   200: '#A8B5DB',
        //   300: '#9CA4AB',
        // },
        // dark: {
        //   100: '#221f3d',
        //   200: '#0f0d23',
        // },
        // accent: '#AB8BFF',
      },
    },
  },
  plugins: [],
};
