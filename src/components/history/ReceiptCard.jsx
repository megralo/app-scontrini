import { Trash2, Pencil } from 'lucide-react'
import { formatEur, formatDate } from '../../lib/format.js'

/**
 * Card per la visualizzazione di un singolo scontrino nella lista History.
 * Mostra merchant, importo, data, categoria e note (troncate a 2 righe).
 * Espone pulsanti accessibili per modifica ed eliminazione.
 *
 * @param {Object}   props
 * @param {Object}   props.receipt           - Dati dello scontrino da visualizzare.
 * @param {string}   [props.categoryColor]   - Colore esadecimale della categoria (dot indicatore).
 * @param {Function} props.onDelete          - Callback invocata con `receipt.id` al click su "Elimina".
 * @param {Function} props.onEdit            - Callback invocata con l'oggetto `receipt` al click su "Modifica".
 */
export default function ReceiptCard({ receipt, categoryColor, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-3">
      {/* Dot categoria */}
      <span
        className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: categoryColor ?? '#6b7280' }}
      />

      {/* Dati */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">{receipt.merchant || '—'}</p>
          <p className="text-sm font-bold text-gray-900 shrink-0">{formatEur(receipt.total)}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-gray-400">{formatDate(receipt.date)}</span>
          <span aria-hidden="true" className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">{receipt.category}</span>
        </div>
        {receipt.notes ? (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{receipt.notes}</p>
        ) : null}
      </div>

      {/* Azioni */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(receipt)}
          className="p-1.5 text-gray-300 active:text-blue-500 transition-colors"
          aria-label={`Modifica ${receipt.merchant || 'scontrino'}`}
        >
          <Pencil size={17} />
        </button>
        <button
          onClick={() => onDelete(receipt.id)}
          className="p-1.5 text-gray-300 active:text-red-500 transition-colors"
          aria-label={`Elimina ${receipt.merchant || 'scontrino'}`}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  )
}