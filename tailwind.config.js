/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f4f0',
        card: '#ffffff',
        'card-accent': '#fff8f2',
        dark: '#2c2519',
        gold: '#c9a97a',
        orange: '#b5622a',
        body: '#5a4f45',
        muted: '#9a8e82',
        border: '#ede8e0',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
        pill: '50px',
      },
      maxWidth: {
        feedback: '680px',
      },
    },
  },
  plugins: [],
}
