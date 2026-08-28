const cx = (...c) => c.filter(Boolean).join(' ')

/**
 * Simple responsive data table.
 * columns: [{ key, header, render?(row), align?, className? }]
 */
export function Table({ columns = [], rows = [], onRowClick, empty, keyField = 'id', className }) {
  if (!rows.length && empty) return empty
  return (
    <div className={cx('overflow-x-auto', className)}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b border-border">
            {columns.map((c) => (
              <th key={c.key} className={cx('py-2.5 px-3 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap',
                c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row[keyField] ?? i}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cx('border-b border-border last:border-0',
                onRowClick && 'cursor-pointer hover:bg-surface-2 transition')}
            >
              {columns.map((c) => (
                <td key={c.key} className={cx('py-3 px-3 text-text align-middle',
                  c.align === 'right' && 'text-right', c.align === 'center' && 'text-center', c.className)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
