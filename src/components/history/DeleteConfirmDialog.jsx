import { AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal.jsx'

/**
 * Dialog di conferma eliminazione scontrino.
 * Presentato come bottom-sheet; usa `aria-labelledby` per associare il titolo al dialog.
 *
 * @param {Object}   props
 * @param {Function} props.onConfirm  - Callback invocata quando l'utente conferma l'eliminazione.
 * @param {Function} props.onCancel   - Callback invocata quando l'utente annulla o chiude il dialog. 
 */
export default function DeleteConfirmDialog({ onConfirm, onCancel }) {
  return (
    <Modal
      isOpen
      onClose={onCancel}
      labelledBy="delete-dialog-title"
      bottomSheet
      className="p-5 flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <div className="bg-red-100 rounded-full p-2 shrink-0">
          <AlertTriangle size={20} className="text-red-500" aria-hidden="true" />
        </div>
        <div>
          <p id="delete-dialog-title" className="text-sm font-semibold text-gray-900">Eliminare questo scontrino?</p>
          <p className="text-sm text-gray-500 mt-0.5">L'operazione non è reversibile.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl active:bg-gray-50 transition-colors text-sm"
        >
          Annulla
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl shadow active:bg-red-700 transition-colors text-sm"
        >
          Elimina
        </button>
      </div>
    </Modal>
  )
}