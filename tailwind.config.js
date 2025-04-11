/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      colors: {
        brand: {
          plum: '#f7adee',
          persian: '#3434ad',
          tyrian: '#440829',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to bottom, #440829, #3434ad)',
      }
    },
  },
  plugins: [],
};