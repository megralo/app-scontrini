/**
 * Card contenitore per le sezioni di Settings.
 * @param {{ title: string, children: React.ReactNode }} props
 */
export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}