/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#14161B',
        'bg-tint': '#1A1D24',
        surface: '#1D212B',
        'surface-2': '#232836',
        ink: '#E6EAF0',
        'ink-soft': '#B2BCCB',
        muted: '#8A93A3',
        accent: { DEFAULT: '#D97757', deep: '#F2A089' },
        sage: '#8FBF8A',
        gold: '#D6B06A',
      },
      fontFamily: {
        disp: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        ar: ['"Noto Sans Arabic"', 'sans-serif'],
      },
      borderRadius: {
        sm: '7px',
        DEFAULT: '14px',
        lg: '22px',
      },
      maxWidth: {
        container: '1440px',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [],
}
