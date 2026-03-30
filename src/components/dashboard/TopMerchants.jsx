import { formatEur } from '../../lib/format.js'

/**
 * Mostra i top esercenti per spesa totale nel mese corrente, con barra proporzionale.
 * Restituisce `null` se l'array è vuoto.
 *
 * @param {Object}   props
 * @param {Array<{merchant: string, total: number, count: number}>} props.merchants
 *   Array di esercenti già ordinati per `total` decrescente (max {@link TOP_MERCHANTS_COUNT} elementi).
 * @returns {React.ReactNode|null}
 */
export default function TopMerchants({ merchants }) {
  // merchants: [{ merchant, total, count }] già ordinati, max 5
  if (!merchants.length) return null

  const maxTotal = merchants[0].total

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Top esercenti</p>

      <ul className="flex flex-col gap-3">
        {merchants.map((item, i) => (
          <li key={item.merchant}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {item.merchant || '—'}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-gray-900">{formatEur(item.total)}</span>
                {item.count > 1 && (
                  <span className="text-xs text-gray-400 ml-1">({item.count})</span>
                )}
              </div>
            </div>
            {/* Bar proporzionale */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full"
                style={{ width: maxTotal > 0 ? `${(item.total / maxTotal) * 100}%` : '0%' }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}