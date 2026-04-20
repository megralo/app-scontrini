import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, PenLine, HardDrive } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { runOcr } from '../lib/ocr.js'
import FileUploader from '../components/scan/FileUploader.jsx'
import OcrProgress from '../components/scan/OcrProgress.jsx'
import ReceiptForm from '../components/scan/ReceiptForm.jsx'

// Stati possibili della pagina
// idle → processing → done
//                  ↘ error → done (form manuale)

export default function Scan() {
  const { add, allCategories } = useApp()
  const navigate = useNavigate()

  const [phase, setPhase]         = useState('idle')     // idle | processing | done | error
  const [ocrMsg, setOcrMsg]       = useState('')
  const [ocrPct, setOcrPct]       = useState(0)
  const [extracted, setExtracted] = useState(null)
  const [errorMsg, setErrorMsg]   = useState('')
  const [saveError, setSaveError] = useState('')

  const handleFile = useCallback(async (file) => {
    setPhase('processing')
    setOcrPct(0)
    setOcrMsg('Avvio analisi…')
    setSaveError('')

    try {
      const result = await runOcr(file, (msg, pct) => {
        setOcrMsg(msg)
        setOcrPct(pct)
      })

      setExtracted(result)
      setPhase('done')
    } catch (err) {
      console.error('OCR error:', err)
      setErrorMsg(
        'Impossibile analizzare l\'immagine. Prova con una foto più nitida ' +
        'o inserisci i dati manualmente.'
      )
      setExtracted(null)
      setPhase('error')
    }
  }, [])

  const handleSave = useCallback((data) => {
    try {
      add(data)
      navigate('/history')
    } catch (err) {
      if (err.name === 'StorageQuotaError') {
        setSaveError(err.message)
      } else {
        throw err
      }
    }
  }, [add, navigate])

  const handleCancel = useCallback(() => {
    setPhase('idle')
    setExtracted(null)
    setErrorMsg('')
    setSaveError('')
    setOcrPct(0)
  }, [])

  const handleManual = useCallback(() => {
    setExtracted(null)
    setOcrMsg('')
    setOcrPct(0)
    setSaveError('')
    setPhase('done')
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-900">Scansiona</h1>
      <p className="text-gray-500 mt-1 text-sm mb-6">Carica uno scontrino</p>

      {phase === 'idle' && (
        <FileUploader onFile={handleFile} />
      )}

      {phase === 'processing' && (
        <OcrProgress message={ocrMsg} progress={ocrPct} />
      )}

      {phase === 'error' && (
        <div className="flex flex-col gap-4">
          <div role="alert" className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl active:bg-gray-50"
            >
              Riprova
            </button>
            <button
              type="button"
              onClick={handleManual}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow active:bg-blue-700"
            >
              <PenLine size={16} />
              Inserisci manualmente
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <>
          {extracted && (
            <div role="status" className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <p className="text-xs text-green-700 font-medium">
                Dati riconosciuti automaticamente — verifica e correggi se necessario.
              </p>
            </div>
          )}
          {saveError && (
            <div role="alert" className="flex gap-3 items-start bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <HardDrive size={20} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{saveError}</p>
            </div>
          )}
          <ReceiptForm
            initial={extracted}
            allCategories={allCategories}
            onSave={handleSave}
            onCancel={handleCancel}
            warnDate={extracted?.dateIsGuessed === true}
          />
        </>
      )}
    </div>
  )
}