module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#16213E',
        secondary: '#0F3460',
        accent: '#533483',
        danger: '#E94560',
      },
      textColor: {
        body: 'rgb(226 232 240)', // slate-200
        secondary: 'rgb(148 163 184)', // slate-400
      },
    },
  },
  plugins: [],
};
