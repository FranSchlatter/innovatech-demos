/* InnovaTech Demo Kit — Tailwind preset. Maps semantic CSS vars to utilities. */
export default {
  theme: {
    extend: {
      colors: {
        background: 'var(--dk-bg)',
        surface: 'var(--dk-surface)',
        'surface-2': 'var(--dk-surface-2)',
        elevated: 'var(--dk-elevated)',
        primary: 'var(--dk-primary)',
        'primary-weak': 'var(--dk-primary-weak)',
        'primary-contrast': 'var(--dk-primary-contrast)',
        text: 'var(--dk-text)',
        heading: 'var(--dk-heading)',
        muted: 'var(--dk-muted)',
        border: 'var(--dk-border)',
        success: 'var(--dk-success)',
        warning: 'var(--dk-warning)',
        danger: 'var(--dk-danger)',
        info: 'var(--dk-info)'
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: 'var(--dk-radius)',
        sm: 'var(--dk-radius-sm)',
        lg: 'var(--dk-radius-lg)'
      },
      boxShadow: {
        kit: 'var(--dk-shadow)',
        ring: '0 0 0 3px var(--dk-ring)'
      },
      ringColor: {
        DEFAULT: 'var(--dk-ring)'
      },
      keyframes: {
        'dk-pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 var(--dk-ring)' },
          '70%': { boxShadow: '0 0 0 12px transparent' },
          '100%': { boxShadow: '0 0 0 0 transparent' }
        },
        'dk-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'pulse-ring': 'dk-pulse-ring 1.8s ease-out infinite',
        'fade-up': 'dk-fade-up 320ms ease-out both'
      }
    }
  }
}
