export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../../packages/shared-ui/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-contrast': 'var(--color-primary-contrast)',
        accent: 'var(--color-accent)',
        gold: 'var(--color-gold)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)'
      }
    }
  },
  plugins: []
}
