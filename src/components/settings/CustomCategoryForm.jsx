import { useState } from 'react'
import { Plus } from 'lucide-react'

// Colore predefinito per le nuove categorie personalizzate (lime-400 Tailwind)
const DEFAULT_CATEGORY_COLOR = '#84cc16'

export default function CustomCategoryForm({ onAdd, existingNames }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(DEFAULT_CATEGORY_COLOR)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('Inserisci un nome'); return }
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) { setError('Categoria già esistente'); return }
    onAdd(trimmed, color)
    setName('')
    setColor(DEFAULT_CATEGORY_COLOR)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="Nome categoria"
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-11 h-11 rounded-xl border border-gray-300 cursor-pointer p-1 shrink-0"
          title="Scegli colore"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-xl px-3 font-semibold text-sm active:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
        >
          <Plus size={16} />
          Aggiungi
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  )
}