/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      maxWidth: {
        'xxs': '16rem',
      },
      height: {
        '120': '34rem',
      },
      width: {
        '112': '28rem',
      }
    }
  },
  plugins: [],
}

