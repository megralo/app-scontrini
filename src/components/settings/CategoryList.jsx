import { Trash2 } from 'lucide-react'

/**
 * Lista delle categorie (predefinite + personalizzate) nella pagina Impostazioni.
 * Per le categorie predefinite mostra il badge "predefinita"; per le custom espone
 * un bottone di eliminazione accessibile.
 *
 * @param {Object}        props
 * @param {Array<Object>} props.allCategories         - Lista completa di categorie (predefinite + custom).
 * @param {string[]}      props.customCategoryNames   - Nomi delle sole categorie personalizzate.
 * @param {Function}      props.onRemove              - Callback invocata con il nome della categoria da eliminare.
 */
export default function CategoryList({ allCategories, customCategoryNames, onRemove }) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {allCategories.map((cat) => {
        const isCustom = customCategoryNames.includes(cat.name)
        return (
          <div key={cat.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-sm text-gray-800">{cat.name}</span>
              {!isCustom && (
                <span className="text-xs text-gray-400">predefinita</span>
              )}
            </div>
            {isCustom && (
              <button
                type="button"
                onClick={() => onRemove(cat.name)}
                className="text-gray-400 active:text-red-500 transition-colors p-1 -mr-1"
                aria-label={`Elimina categoria ${cat.name}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}