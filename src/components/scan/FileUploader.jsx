import { useRef, useState } from 'react'
import { Upload, ImagePlus } from 'lucide-react'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

/**
 * Area di caricamento file con drag-and-drop e selezione tramite input.
 * Valida tipo (JPEG/PNG/WEBP) e dimensione (max 8 MB) prima di invocare `onFile`.
 * Usa un `dragCounter` ref per gestire correttamente gli eventi `dragenter`/`dragleave`
 * sui figli dell'area senza falsi negativi (fix QA4).
 *
 * @param {Object}   props
 * @param {Function} props.onFile  - Callback invocata con il `File` selezionato dopo la validazione.
 */
export default function FileUploader({ onFile }) {
  const inputRef = useRef(null)
  const dragCounter = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  function handleFiles(files) {
    const file = files?.[0]
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      setError('Formato non supportato. Usa JPG, PNG o WEBP.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File troppo grande. Dimensione massima: 8 MB.')
      return
    }
    setError('')
    onFile(file)
  }

  function onDragEnter(e) {
    e.preventDefault()
    dragCounter.current += 1
    if (dragCounter.current === 1) setDragging(true)
  }

  function onDragOver(e) {
    e.preventDefault()
  }

  function onDragLeave() {
    dragCounter.current -= 1
    if (dragCounter.current === 0) setDragging(false)
  }

  function onDrop(e) {
    e.preventDefault()
    dragCounter.current = 0
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full max-w-sm rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 transition-colors focus:outline-none
          ${dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 active:bg-gray-100'
          }`}
      >
        <div className={`rounded-full p-4 ${dragging ? 'bg-blue-100' : 'bg-white'} shadow-sm`}>
          <ImagePlus size={32} className={dragging ? 'text-blue-500' : 'text-gray-400'} strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700">Carica scontrino</p>
          <p className="text-sm text-gray-400 mt-1">JPG, PNG o WEBP</p>
        </div>
      </button>

      {/* CTA button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow active:bg-blue-700 transition-colors"
      >
        <Upload size={18} />
        Scegli immagine
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Tooltip primo utilizzo */}
      <p className="text-xs text-center text-gray-400 px-4 max-w-xs">
        Scatta o carica la foto di uno scontrino. Il riconoscimento avviene
        direttamente sul tuo dispositivo — nessun dato viene inviato online.
      </p>

      {error && (
        <p role="alert" className="text-xs text-center text-red-600 px-4 max-w-xs">{error}</p>
      )}
    </div>
  )
}