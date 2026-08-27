// Reusable status/pill badge for the admin panel.
// Maps a semantic tone to Tailwind theme colors (works in dark + light).
const toneStyles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
  accent: 'bg-accent/15 text-accent',
  primary: 'bg-primary/15 text-primary',
  muted: 'bg-surface-alt text-muted'
}

export default function StatusBadge({ label, tone = 'muted', dot = true }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${toneStyles[tone] || toneStyles.muted}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {label}
    </span>
  )
}
