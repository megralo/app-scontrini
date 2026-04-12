import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Badge from '../ui/Badge.jsx'

/**
 * Pannello filtri per la pagina History.
 * Consente di filtrare gli scontrini per intervallo di date e per categorie.
 * Il warning di intervallo date non valido appare solo dopo che l'utente
 * lascia il campo data fine (`onBlur`).
 *
 * @param {Object}        props
 * @param {Array<Object>} props.allCategories        - Lista completa di categorie disponibili.
 * @param {string[]}      props.selectedCategories   - Categorie attualmente selezionate.
 * @param {Function}      props.onCategoriesChange   - Callback quando la selezione categorie cambia.
 * @param {string}        props.dateFrom             - Data di inizio filtro (formato `YYYY-MM-DD`).
 * @param {string}        props.dateTo               - Data di fine filtro (formato `YYYY-MM-DD`).
 * @param {Function}      props.onDateFromChange     - Callback quando la data di inizio cambia.
 * @param {Function}      props.onDateToChange       - Callback quando la data di fine cambia.
 */
export default function FilterPanel({ allCategories, selectedCategories, onCategoriesChange, dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  const [open, setOpen] = useState(false)
  // Mostra il warning date solo dopo che l'utente ha lasciato il campo
  const [dateTouched, setDateTouched] = useState(false)

  useEffect(() => {
    if (!dateTo) setDateTouched(false)
  }, [dateTo])

  const activeCount =
    selectedCategories.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)

  function toggleCategory(name) {
    if (selectedCategories.includes(name)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== name))
    } else {
      onCategoriesChange([...selectedCategories, name])
    }
  }

  function clearAll() {
    onCategoriesChange([])
    onDateFromChange('')
    onDateToChange('')
    setDateTouched(false)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 active:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          Filtri
          {activeCount > 0 && <Badge label={activeCount} />}
        </span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-100">
          {/* Intervallo date */}
          <div className="flex gap-3 pt-3">
            <div className="flex-1">
              <label htmlFor="filter-date-from" className="block text-xs font-medium text-gray-500 mb-1">Dal</label>
              <input
                id="filter-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="filter-date-to" className="block text-xs font-medium text-gray-500 mb-1">Al</label>
              <input
                id="filter-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                onBlur={() => setDateTouched(true)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {dateTouched && dateFrom && dateTo && dateFrom > dateTo && (
            <p role="status" className="text-xs text-amber-600 -mt-2">
              Attenzione: la data di inizio è successiva alla data di fine.
            </p>
          )}

          {/* Categorie */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Categoria</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const active = selectedCategories.includes(cat.name)
                return (
                  <button
                    key={cat.name}
                    type="button"
                    aria-pressed={selectedCategories.includes(cat.name)}
                    onClick={() => toggleCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      active
                        ? 'text-white border-transparent'
                        : 'text-gray-600 border-gray-300 bg-white'
                    }`}
                    style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: active ? 'rgba(255,255,255,0.7)' : cat.color }}
                    />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium self-start"
            >
              <X size={13} />
              Rimuovi filtri
            </button>
          )}
        </div>
      )}
    </div>
  )
}