import { generateId } from './uuid.js'

/**
 * Normalizza un oggetto scontrino grezzo assicurando che tutti i campi
 * abbiano valori validi e tipi corretti. Genera un nuovo id se mancante.
 * Usata da `useReceipts.mergeImport` / `replaceAll` durante l'import di backup.
 *
 * @param {Object} r - Scontrino grezzo (es. proveniente da un file JSON importato).
 * @returns {{ id: string, date: string, merchant: string, total: number, category: string, notes: string, createdAt: string }}
 */
export function normalizeReceipt(r) {
  return {
    id: r.id ?? generateId(),
    date: typeof r.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date)
      ? r.date
      : new Date().toISOString().slice(0, 10),
    merchant: String(r.merchant ?? ''),
    total: Number(r.total) || 0,
    category: String(r.category ?? 'Altro'),
    notes: String(r.notes ?? ''),
    createdAt: r.createdAt ?? new Date().toISOString(),
  }
}
