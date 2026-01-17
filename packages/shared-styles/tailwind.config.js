/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "../../packages/shared-ui/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-contrast': 'var(--color-primary-contrast)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)'
      },
      fontFamily: {
        sans: 'var(--font-family-base)'
      },
      fontSize: {
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'base': 'var(--font-size-base)',
        'sm': 'var(--font-size-sm)'
      },
      borderRadius: {
        'theme': 'var(--radius)'
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)'
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'medium': 'var(--transition-medium)'
      }
    }
  },
  plugins: []
}
