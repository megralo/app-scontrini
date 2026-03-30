import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import MonthSummary from '../components/dashboard/MonthSummary.jsx'
import CategoryPieChart from '../components/dashboard/CategoryPieChart.jsx'
import TopMerchants from '../components/dashboard/TopMerchants.jsx'
import { monthPrefix } from '../lib/format.js'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useColorMap } from '../hooks/useColorMap.js'

// Numero massimo di esercenti mostrati nel widget Top Merchants
const TOP_MERCHANTS_COUNT = 5

export default function Dashboard() {
  const { receipts, allCategories } = useApp()

  const now          = new Date()
  const currentYear  = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const prevYear     = currentMonth === 1 ? currentYear - 1 : currentYear
  const prevMonth    = currentMonth === 1 ? 12 : currentMonth - 1

  const curPrefix  = monthPrefix(now)
  const prevPrefix = monthPrefix(new Date(prevYear, prevMonth - 1, 1))

  // Mappa nome categoria → colore
  const colorMap = useColorMap(allCategories)

  const currentReceipts = useMemo(
    () => receipts.filter((r) => r.date.startsWith(curPrefix)),
    [receipts, curPrefix]
  )

  const prevReceipts = useMemo(
    () => receipts.filter((r) => r.date.startsWith(prevPrefix)),
    [receipts, prevPrefix]
  )

  const currentTotal = useMemo(
    () => currentReceipts.reduce((sum, r) => sum + (Number(r.total) || 0), 0),
    [currentReceipts]
  )

  const prevTotal = useMemo(
    () => prevReceipts.reduce((sum, r) => sum + (Number(r.total) || 0), 0),
    [prevReceipts]
  )

  // Dati grafico torta: raggruppa per categoria, somma totali, ordina desc
  const pieData = useMemo(() => {
    const map = {}
    currentReceipts.forEach((r) => {
      map[r.category] = (map[r.category] ?? 0) + (Number(r.total) || 0)
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: colorMap[name] ?? '#6b7280' }))
      .sort((a, b) => b.value - a.value)
  }, [currentReceipts, colorMap])

  // Top 5 esercenti per totale (mese corrente)
  const topMerchants = useMemo(() => {
    const map = {}
    currentReceipts.forEach((r) => {
      const key = r.merchant || '—'
      if (!map[key]) map[key] = { merchant: key, total: 0, count: 0 }
      map[key].total += (Number(r.total) || 0)
      map[key].count += 1
    })
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_MERCHANTS_COUNT)
  }, [currentReceipts])

  const isEmpty = receipts.length === 0

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Statistiche mese corrente</p>
      </div>

      {isEmpty ? (
        <EmptyState message="Nessuno scontrino ancora salvato." className="py-20">
          <Link
            to="/scan"
            className="mt-2 text-sm text-indigo-600 font-medium active:opacity-70"
          >
            Aggiungi il primo →
          </Link>
        </EmptyState>
      ) : (
        <>
          <MonthSummary
            currentTotal={currentTotal}
            prevTotal={prevTotal}
            currentYear={currentYear}
            currentMonth={currentMonth}
          />

          {currentReceipts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 px-4 text-center">
              <EmptyState message="Nessuna spesa registrata questo mese." className="py-6" />
            </div>
          ) : (
            <>
              <CategoryPieChart data={pieData} />
              <TopMerchants merchants={topMerchants} />
            </>
          )}
        </>
      )}
    </div>
  )
}