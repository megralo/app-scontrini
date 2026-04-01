import Modal from '../ui/Modal.jsx'
import ReceiptForm from '../scan/ReceiptForm.jsx'

/**
 * Modal di modifica di uno scontrino esistente.
 * Wrappa `ReceiptForm` in un `Modal` scrollable con idPrefix dedicato ("edit-receipt-").
 *
 * @param {Object}        props
 * @param {Object}        props.receipt        - Scontrino da modificare (valori iniziali del form).
 * @param {Array<Object>} props.allCategories  - Lista completa di categorie disponibili.
 * @param {Function}      props.onSave         - Callback invocata con i dati aggiornati al submit.
 * @param {Function}      props.onCancel       - Callback invocata alla chiusura senza salvataggio.
 */
export default function EditReceiptDialog({ receipt, allCategories, onSave, onCancel }) {
  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="Modifica scontrino"
      scrollable
      className="px-4 pt-5 pb-6"
    >
      <ReceiptForm
        initial={receipt}
        allCategories={allCategories}
        onSave={onSave}
        onCancel={onCancel}
        idPrefix="edit-receipt-"
      />
    </Modal>
  )
}