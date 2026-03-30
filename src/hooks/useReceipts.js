import { useState, useCallback } from 'react'
import {
  loadReceipts,
  deleteReceipt as storageDelete,
  updateReceipt as storageUpdate,
  saveReceipts,
} from '../lib/storage.js'
import { generateId } from '../lib/uuid.js'

/**
 * Normalizza un oggetto scontrino grezzo assicurando che tutti i campi
 * abbiano valori validi e tipi corretti. Genera un nuovo id se mancante.
 *
 * @param {Object} r - Scontrino grezzo (es. proveniente da un file JSON importato).
 * @returns {{ id: string, date: string, merchant: string, total: number, category: string, notes: string, createdAt: string }}
 */
function normalizeReceipt(r) {
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

/**
 * Custom hook per la gestione degli scontrini.
 * Mantiene lo stato React sincronizzato con il localStorage tramite
 * le operazioni di `src/lib/storage.js`.
 *
 * @returns {{
 *   receipts: Array<Object>,
 *   add:         (data: Object) => Object,
 *   update:      (id: string, data: Object) => void,
 *   remove:      (id: string) => void,
 *   mergeImport: (incoming: Array<Object>) => { added: number, skipped: number },
 *   replaceAll:  (incoming: Array<Object>) => void,
 * }}
 */
export function useReceipts() {
  const [receipts, setReceipts] = useState(() => loadReceipts())

  /**
   * Crea un nuovo scontrino, lo persiste nello storage e lo aggiunge in cima allo stato.
   *
   * @param {Object} data - Dati del nuovo scontrino (date, merchant, total, category, notes).
   * @returns {Object} Scontrino creato con id e createdAt assegnati.
   */
  const add = useCallback((data) => {
    const receipt = {
      id: generateId(),
      date: data.date,
      merchant: data.merchant ?? '',
      total: typeof data.total === 'number' ? data.total : parseFloat(data.total) || 0,
      category: data.category ?? 'Altro',
      notes: data.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    const newList = [receipt, ...receipts]
    saveReceipts(newList)
    setReceipts(newList)
    return receipt
  }, [receipts])

  /**
   * Elimina lo scontrino con l'id specificato dallo storage e dallo stato.
   *
   * @param {string} id - Identificatore univoco dello scontrino da eliminare.
   */
  const remove = useCallback((id) => {
    storageDelete(id)
    setReceipts((prev) => prev.filter((r) => r.id !== id))
  }, [])

  /**
   * Aggiorna i campi di uno scontrino esistente (merge parziale).
   *
   * @param {string} id   - Identificatore univoco dello scontrino da aggiornare.
   * @param {Object} data - Campi da sovrascrivere.
   */
  const update = useCallback((id, data) => {
    storageUpdate(id, data)
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data, id } : r))
    )
  }, [])

  /**
   * Importa un array di scontrini fondendoli con quelli esistenti.
   * I duplicati sono individuati tramite la chiave composita `date|merchant|total`.
   *
   * @param {Array<Object>} incoming - Scontrini da importare.
   * @returns {{ added: number, skipped: number }} Conteggio degli scontrini aggiunti e ignorati.
   */
  const mergeImport = useCallback((incoming) => {
    const existing = loadReceipts()
    const keys = new Set(existing.map((r) => `${r.date}|${r.merchant}|${r.total}`))
    const toAdd = incoming
      .map(normalizeReceipt)
      .filter((r) => !keys.has(`${r.date}|${r.merchant}|${r.total}`))
    const merged = [...existing, ...toAdd].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    saveReceipts(merged)
    setReceipts(merged)
    return { added: toAdd.length, skipped: incoming.length - toAdd.length }
  }, [])

  /**
   * Sostituisce tutti gli scontrini esistenti con quelli forniti.
   * I dati vengono normalizzati e ordinati per data decrescente.
   *
   * @param {Array<Object>} incoming - Nuovi scontrini che sostituiranno quelli attuali.
   */
  const replaceAll = useCallback((incoming) => {
    const sorted = [...incoming].map(normalizeReceipt).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    saveReceipts(sorted)
    setReceipts(sorted)
  }, [])

  return { receipts, add, update, remove, mergeImport, replaceAll }
}