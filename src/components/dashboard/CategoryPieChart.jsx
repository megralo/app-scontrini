import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatEur } from '../../lib/format.js'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-xs">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-gray-500">{formatEur(value)}</p>
    </div>
  )
}

export default function CategoryPieChart({ data }) {
  // data: [{ name, value, color }]
  if (!data.length) return null

  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Spesa per categoria</p>

      <div role="img" aria-label="Grafico spesa per categoria">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tabella accessibile per screen reader */}
      <table className="sr-only">
        <caption>Spesa per categoria</caption>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            <th scope="col">Importo</th>
            <th scope="col">Percentuale</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.name}>
              <td>{entry.name}</td>
              <td>{formatEur(entry.value)}</td>
              <td>{total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0'}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legenda */}
      <ul className="mt-2 flex flex-col gap-1.5" aria-hidden="true">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600 truncate">{entry.name}</span>
            </div>
            <span className="text-xs font-medium text-gray-800 shrink-0">{formatEur(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}