/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'survey-background': '#d8ecf3',
        'survey-primary': '#24475d',
        'survey-primary-light': '#3a637e',
        'survey-secondary': '#47BBC6',
        'survey-dark': '#25485E',
      },
    },
  },
  plugins: [],
};
