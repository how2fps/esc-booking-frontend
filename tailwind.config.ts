import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      padding: {
        '15': '60px',
      }
    },
    container: {
      padding: {
        DEFAULT: '16px',
      },
    },
    colors: {
      transparent: 'transparent',
      'primary': '#E05028',
      'primary-hover': '#c42e04',
      'black': '#382C28',
      'variant1': '#776E6B',
      'variant2': '#B4ABA8',
      'white': '#ffffff',
      'outline': '#E4E4E4',
      'surface': '#F8F8F8',
      'red': '#C72929',
      'success': '#37B853',
      'yellow': '#F4D118',
      'line': '#E9E9E9',
    },
  },
  plugins: [],
}
export default config
