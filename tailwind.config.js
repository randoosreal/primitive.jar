/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff3333',
        'primary-hover': '#ff4d4d',
        'primary-muted': '#cc2929',
        background: '#000000',
        foreground: '#ff3333',
        muted: '#1a1a1a',
        'muted-foreground': '#ff6666',
        border: '#ff3333',
        'border-muted': '#331111',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
