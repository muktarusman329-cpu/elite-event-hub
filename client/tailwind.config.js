export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 25px 80px rgba(15, 23, 42, 0.14)',
      },
      backgroundImage: {
        hero: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80')",
      },
      colors: {
        brand: {
          50: '#eef7f7',
          100: '#d9eeec',
          500: '#0f766e',
          600: '#115e59',
        },
      },
    },
  },
  plugins: [],
};
