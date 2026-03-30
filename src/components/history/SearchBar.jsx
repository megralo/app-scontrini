import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SearchBar({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value)

  // Propaga il valore al parent con debounce di 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, 200)
    return () => clearTimeout(timer)
  }, [inputValue]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizza se il parent resetta il valore dall'esterno
  useEffect(() => {
    setInputValue(value)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClear() {
    setInputValue('')
    onChange('')
  }

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Cerca scontrini"
        placeholder="Cerca esercente…"
        className="w-full rounded-xl border border-gray-300 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          aria-label="Cancella ricerca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}