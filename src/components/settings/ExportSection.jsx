import { useState } from 'react'
import { Download } from 'lucide-react'
import { dumpAll } from '../../lib/storage.js'
import { downloadFile } from '../../lib/download.js'
import { formatDate } from '../../lib/format.js'

/**
 * Sezione impostazioni per l'esportazione dei dati.
 * Permette di scaricare gli scontrini in formato CSV (compatibile con Excel/Fogli Google)
 * oppure un backup completo (scontrini + impostazioni) in formato JSON.
 *
 * @param {Object}        props
 * @param {Array<Object>} props.receipts - Lista degli scontrini da esportare.
 *                                        Il pulsante CSV è disabilitato se l'array è vuoto.
 */
export default function ExportSection({ receipts }) {
  const [isExporting, setIsExporting] = useState(null) // 'csv' | 'json' | null

  function triggerExport(type, fn) {
    fn()
    setIsExporting(type)
    setTimeout(() => setIsExporting(null), 1000)
  }

  function handleExportCSV() {
    const header = 'data,data_leggibile,esercente,totale,categoria,note'
    const rows = receipts.map((r) => {
      const esc = (v) => `"${String(v ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""')}"`
      return [
        r.date,
        formatDate(r.date),
        esc(r.merchant),
        Number(r.total).toFixed(2),
        esc(r.category),
        esc(r.notes),
      ].join(',')
    })
    const csv = [header, ...rows].join('\n')
    const today = new Date().toISOString().slice(0, 10)
    downloadFile('\uFEFF' + csv, `scontrini_${today}.csv`, 'text/csv;charset=utf-8;')
  }

  function handleExportJSON() {
    const data = dumpAll()
    const json = JSON.stringify(data, null, 2)
    const today = new Date().toISOString().slice(0, 10)
    downloadFile(json, `scontrini_backup_${today}.json`, 'application/json')
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => triggerExport('csv', handleExportCSV)}
        disabled={receipts.length === 0 || isExporting === 'csv'}
        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 active:bg-gray-50 transition-colors disabled:opacity-40"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">Esporta CSV</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isExporting === 'csv' ? 'Download in corso…' : 'Compatibile con Excel e Fogli Google'}
          </p>
        </div>
        <Download size={18} className="text-gray-400 shrink-0" />
      </button>

      <button
        type="button"
        onClick={() => triggerExport('json', handleExportJSON)}
        disabled={isExporting === 'json'}
        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 active:bg-gray-50 transition-colors disabled:opacity-40"
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">Esporta JSON</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isExporting === 'json' ? 'Download in corso…' : 'Backup completo (scontrini + impostazioni)'}
          </p>
        </div>
        <Download size={18} className="text-gray-400 shrink-0" />
      </button>
    </div>
  )
}