import { useState, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import Modal from '../ui/Modal.jsx'

/**
 * Sezione impostazioni per l'importazione di un backup JSON.
 * Dopo la selezione del file, mostra un modale per scegliere tra "Unisci" e "Sostituisci tutto".
 * L'input file viene resettato dopo ogni operazione per permettere la ri-selezione dello stesso file.
 *
 * @param {Object}   props
 * @param {Function} props.onMerge   - Callback invocata con `(receipts, settings)` per importazione merge.
 *                                     Deve restituire `{ added: number, skipped: number }`.
 * @param {Function} props.onReplace - Callback invocata con `(receipts, settings)` per sostituzione totale.
 */
export default function ImportSection({ onMerge, onReplace }) {
  const [parsed, setParsed]         = useState(null)
  const [parseError, setParseError] = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [result, setResult]         = useState(null)
  const [quotaError, setQuotaError] = useState('')
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error()
        if ('receipts' in data) {
          if (!Array.isArray(data.receipts)) {
            setParseError('Formato non valido: il campo "receipts" deve essere un array.')
            setParsed(null)
            return
          }
          const malformed = data.receipts.findIndex(
            (r) => !r || typeof r !== 'object' || !r.id || !r.date || r.total == null
          )
          if (malformed !== -1) {
            setParseError(`Formato non valido: lo scontrino alla posizione ${malformed} manca dei campi obbligatori (id, date, total).`)
            setParsed(null)
            return
          }
        }
        setParsed(data)
        setParseError('')
        setResult(null)
        setShowModal(true)
      } catch {
        setParseError('File non valido. Assicurati di importare un backup JSON generato da questa app.')
        setParsed(null)
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset per permettere ri-selezione dello stesso file
  }

  function handleMerge() {
    const receipts = Array.isArray(parsed?.receipts) ? parsed.receipts : []
    try {
      const res = onMerge(receipts, parsed?.settings ?? null)
      setResult({ type: 'merge', ...res })
      setQuotaError('')
    } catch (err) {
      if (err.name === 'StorageQuotaError') {
        setQuotaError(err.message)
      } else {
        throw err
      }
    }
    setShowModal(false)
    setParsed(null)
  }

  function handleReplace() {
    const receipts = Array.isArray(parsed?.receipts) ? parsed.receipts : []
    try {
      onReplace(receipts, parsed?.settings ?? null)
      setResult({ type: 'replace', count: receipts.length })
      setQuotaError('')
    } catch (err) {
      if (err.name === 'StorageQuotaError') {
        setQuotaError(err.message)
      } else {
        throw err
      }
    }
    setShowModal(false)
    setParsed(null)
  }

  function handleCancel() {
    setShowModal(false)
    setParsed(null)
  }

  const receiptCount = Array.isArray(parsed?.receipts) ? parsed.receipts.length : 0

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => { setResult(null); setParseError(''); fileRef.current?.click() }}
          className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 active:bg-gray-50 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">Importa JSON</p>
            <p className="text-xs text-gray-500 mt-0.5">Ripristina da un backup precedente</p>
          </div>
          <Upload size={18} className="text-gray-400 shrink-0" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFile}
        />

        {parseError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{parseError}</p>
          </div>
        )}

        {quotaError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{quotaError}</p>
          </div>
        )}

        {result && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              {result.type === 'merge'
                ? `Importazione completata: ${result.added} scontrin${result.added === 1 ? 'o aggiunto' : 'i aggiunti'}${result.skipped > 0 ? `, ${result.skipped} ignorat${result.skipped === 1 ? 'o' : 'i'} (duplicati)` : ''}.`
                : `Dati sostituiti: ${result.count} scontrin${result.count === 1 ? 'o importato' : 'i importati'}.`}
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={handleCancel} bottomSheet title="Come vuoi importare?">
        <div className="p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Come vuoi importare?</p>
            <p className="text-sm text-gray-500 mt-1">
              Il file contiene {receiptCount} scontrin{receiptCount === 1 ? 'o' : 'i'}.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleMerge}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow active:bg-blue-700 transition-colors text-sm"
            >
              Unisci — mantieni i tuoi dati
            </button>
            <p className="text-xs text-gray-400 text-center -mt-1">
              Aggiunge i nuovi scontrini, ignora i duplicati
            </p>

            <button
              type="button"
              onClick={handleReplace}
              className="w-full bg-white border border-red-300 text-red-600 font-semibold py-3 rounded-xl active:bg-red-50 transition-colors text-sm mt-1"
            >
              Sostituisci tutto
            </button>
            <p className="text-xs text-gray-400 text-center -mt-1">
              Cancella tutti i dati attuali e li rimpiazza
            </p>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full text-gray-500 font-medium py-2 text-sm mt-1"
            >
              Annulla
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}