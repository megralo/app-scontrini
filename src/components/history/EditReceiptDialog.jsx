import Modal from '../ui/Modal.jsx'
import ReceiptForm from '../scan/ReceiptForm.jsx'

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