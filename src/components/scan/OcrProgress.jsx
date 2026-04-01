import { ScanLine } from 'lucide-react'

// Dimensione stimata del pacchetto lingua Tesseract (italiano)
const OCR_LANG_PACK_SIZE_MB = 4

/**
 * Indicatore di avanzamento per l'elaborazione OCR.
 * Espone una progress bar con `role="progressbar"` e attributi ARIA completi,
 * e un messaggio di stato con `aria-live="polite"` per i lettori di schermo.
 *
 * @param {Object} props
 * @param {string} props.message   - Testo descrittivo della fase corrente (es. "Caricamento motore OCR…").
 * @param {number} props.progress  - Percentuale di avanzamento (0–100).
 */
export default function OcrProgress({ message, progress }) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 px-4">
      <div className="rounded-full bg-blue-50 p-5">
        <ScanLine size={36} className="text-blue-500 animate-pulse" strokeWidth={1.5} />
      </div>

      <div className="w-full max-w-sm text-center">
        <p className="font-semibold text-gray-800 mb-1">Elaborazione in corso…</p>
        <p className="text-sm text-gray-500 min-h-[1.25rem]" aria-live="polite" aria-atomic="true">{message}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Avanzamento</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Avanzamento analisi OCR"
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 px-4 max-w-xs">
        La prima analisi scarica il pacchetto lingua (~{OCR_LANG_PACK_SIZE_MB} MB). Operazione necessaria una sola volta.
      </p>
    </div>
  )
}