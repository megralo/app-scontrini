import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { parseAmount } from '../../lib/parseAmount.js'

/**
 * Form per l'inserimento e la modifica dei dati di uno scontrino.
 * Gestisce validazione inline e richiama le callback al salvataggio/annullamento.
 *
 * @param {Object}        props
 * @param {Object}        [props.initial]                  - Valori iniziali del form (usato in modalità modifica).
 * @param {Array<Object>} props.allCategories              - Lista di categorie disponibili (predefinite + custom).
 * @param {Function}      props.onSave                     - Callback invocata con i dati validati al submit.
 * @param {Function}      props.onCancel                   - Callback invocata quando l'utente annulla.
 * @param {boolean}       [props.warnDate]                 - Se `true`, mostra un avviso sotto il campo data (data stimata dall'OCR).
 * @param {string}        [props.idPrefix='receipt-']      - Prefisso per gli `id` degli input; evita collisioni tra istanze multiple del form.
 */
export default function ReceiptForm({ initial, allCategories, onSave, onCancel, warnDate, idPrefix = 'receipt-' }) {
  const today = new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    date:     initial?.date     ?? today,
    merchant: initial?.merchant ?? '',
    total:    initial?.total    != null ? String(initial.total) : '',
    category: allCategories.some((c) => c.name === initial?.category) ? initial.category : 'Altro',
    notes:    initial?.notes ?? '',
  })

  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function validate(amount) {
    const e = {}
    if (!form.date) e.date = 'Inserisci una data'
    if (!form.merchant.trim()) e.merchant = 'Inserisci il nome dell\'esercente'
    if (!form.total || isNaN(amount) || amount <= 0) e.total = 'Importo non valido'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const parsedAmount = parseAmount(form.total)
    const e2 = validate(parsedAmount)
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    onSave({
      date:     form.date,
      merchant: form.merchant.trim(),
      total:    parsedAmount,
      category: form.category,
      notes:    form.notes.trim(),
    })
  }

  const selectedCat = allCategories.find((c) => c.name === form.category)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4">
      <h2 className="text-base font-semibold text-gray-700">Dati scontrino</h2>

      {/* Data */}
      <div>
        <label htmlFor={`${idPrefix}date`} className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <input
          id={`${idPrefix}date`}
          type="date"
          aria-required="true"
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? `${idPrefix}date-error` : undefined}
          value={form.date}
          min="2000-01-01"
          max={today}
          onChange={(e) => set('date', e.target.value)}
          className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
        />
        {warnDate && !errors.date && (
          <p className="text-xs text-amber-600 mt-1">Data non rilevata — verificare</p>
        )}
        {errors.date && (
          <p id={`${idPrefix}date-error`} role="alert" className="text-xs text-red-500 mt-1">
            {errors.date}
          </p>
        )}
      </div>

      {/* Esercente */}
      <div>
        <label htmlFor={`${idPrefix}merchant`} className="block text-sm font-medium text-gray-700 mb-1">Esercente</label>
        <input
          id={`${idPrefix}merchant`}
          type="text"
          aria-required="true"
          aria-invalid={!!errors.merchant}
          aria-describedby={errors.merchant ? `${idPrefix}merchant-error` : undefined}
          value={form.merchant}
          onChange={(e) => set('merchant', e.target.value)}
          placeholder="Es. Esselunga, Bar Roma…"
          className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.merchant ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.merchant && (
          <p id={`${idPrefix}merchant-error`} role="alert" className="text-xs text-red-500 mt-1">
            {errors.merchant}
          </p>
        )}
      </div>

      {/* Totale */}
      <div>
        <label htmlFor={`${idPrefix}total`} className="block text-sm font-medium text-gray-700 mb-1">Totale (€)</label>
        <input
          id={`${idPrefix}total`}
          type="text"
          aria-required="true"
          aria-invalid={!!errors.total}
          aria-describedby={errors.total ? `${idPrefix}total-error` : undefined}
          inputMode="decimal"
          value={form.total}
          onChange={(e) => set('total', e.target.value)}
          placeholder="0,00"
          className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.total ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.total && (
          <p id={`${idPrefix}total-error`} role="alert" className="text-xs text-red-500 mt-1">
            {errors.total}
          </p>
        )}
      </div>

      {/* Categoria */}
      <div>
        <label htmlFor={`${idPrefix}category`} className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <div className="relative">
          {selectedCat && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedCat.color }}
            />
          )}
          <select
            id={`${idPrefix}category`}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-8 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {allCategories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Note */}
      <div>
        <label htmlFor={`${idPrefix}notes`} className="block text-sm font-medium text-gray-700 mb-1">
          Note <span className="text-gray-400 font-normal">(opzionale)</span>
        </label>
        <textarea
          id={`${idPrefix}notes`}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Aggiungi una nota…"
          rows={2}
          className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Azioni */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl active:bg-gray-50 transition-colors"
        >
          <X size={16} />
          Annulla
        </button>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow active:bg-blue-700 transition-colors"
        >
          <Check size={16} />
          Salva
        </button>
      </div>
    </form>
  )
}