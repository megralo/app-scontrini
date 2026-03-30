import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { formatEur, monthLabel, monthPrefix } from '../../lib/format.js'

// Soglia minima (€) per considerare una variazione mensile significativa
const TREND_THRESHOLD = 0.005

/**
 * Riepilogo mensile con totale corrente e indicatore di trend rispetto al mese precedente.
 * Il trend è mostrato solo se la differenza assoluta supera {@link TREND_THRESHOLD} (0.5%).
 * Trend positivo (spesa aumentata) → rosso; trend negativo → verde; invariato → grigio.
 *
 * @param {Object} props
 * @param {number} props.currentTotal  - Totale speso nel mese corrente in €.
 * @param {number} props.prevTotal     - Totale speso nel mese precedente in €.
 * @param {number} props.currentYear   - Anno del mese corrente (es. 2026).
 * @param {number} props.currentMonth  - Mese corrente 1–12.
 * @returns {React.ReactNode}
 */
export default function MonthSummary({ currentTotal, prevTotal, currentYear, currentMonth }) {
  const prevYear  = currentMonth === 1 ? currentYear - 1 : currentYear
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1

  const curYM  = monthPrefix(new Date(currentYear, currentMonth - 1, 1))
  const prevYM = monthPrefix(new Date(prevYear, prevMonth - 1, 1))

  const diff = currentTotal - prevTotal
  const pct  = prevTotal > 0 ? Math.abs((diff / prevTotal) * 100) : null

  let TrendIcon  = Minus
  let trendColor = 'text-gray-400'
  let trendLabel = 'uguale al mese precedente'

  if (diff > TREND_THRESHOLD) {
    TrendIcon  = TrendingUp
    trendColor = 'text-red-500'
    trendLabel = `+${pct !== null ? pct.toFixed(0) + '%' : ''} vs ${monthLabel(prevYM)}`
  } else if (diff < -TREND_THRESHOLD) {
    TrendIcon  = TrendingDown
    trendColor = 'text-green-500'
    trendLabel = `-${pct !== null ? pct.toFixed(0) + '%' : ''} vs ${monthLabel(prevYM)}`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {monthLabel(curYM)}
      </p>
      <p className="text-3xl font-bold text-gray-900">{formatEur(currentTotal)}</p>

      <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
        <TrendIcon size={14} />
        <span className="text-xs">{trendLabel}</span>
        {diff !== 0 && prevTotal > 0 && (
          <span className="text-xs text-gray-400 ml-1">
            ({formatEur(prevTotal)} il mese scorso)
          </span>
        )}
      </div>
    </div>
  )
}