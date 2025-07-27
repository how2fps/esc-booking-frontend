import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
        DEFAULT: '5px',
      },
    },
    colors: {
      transparent: 'transparent',
      'primary': '#E05028',
      'primary-hover': '#c42e04',
      'black': '#382C28',
      'variant1': '#776E6B',
      'variant2': '#B4ABA8',
      'white': '#efefef',
      'outline': '#E4E4E4',
      'surface': '#efefef',
      'red': '#C72929',
      'success': '#37B853',
      'yellow': '#F4D118',
      'line': '#E9E9E9',
    },
  },
  plugins: [],
}
export default config
