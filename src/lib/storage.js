const KEYS = {
  RECEIPTS: 'scontrini_receipts',
  SETTINGS: 'scontrini_settings',
}

// Errore custom lanciato quando localStorage è pieno (quota ~5-10 MB)
export class StorageQuotaError extends Error {
  constructor() {
    super('Spazio di archiviazione esaurito. Elimina alcuni scontrini per continuare.')
    this.name = 'StorageQuotaError'
  }
}

// ── Receipts ──────────────────────────────────────────────────────────────────

/**
 * Legge tutti gli scontrini dal localStorage.
 *
 * @returns {Array<Object>} Array di scontrini salvati, o array vuoto in caso di errore o assenza dati.
 */
export function loadReceipts() {
  try {
    const raw = localStorage.getItem(KEYS.RECEIPTS)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('[storage] Dati corrotti, usati valori di default:', e.message)
    return []
  }
}

/**
 * Serializza e salva l'array di scontrini nel localStorage.
 *
 * @param {Array<Object>} receipts - Array di scontrini da persistere.
 * @throws {StorageQuotaError} Se il localStorage ha esaurito la quota disponibile.
 */
export function saveReceipts(receipts) {
  try {
    localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(receipts))
  } catch (e) {
    throw new StorageQuotaError()
  }
}

/**
 * Elimina lo scontrino con l'id specificato.
 *
 * @param {string} id - Identificatore univoco dello scontrino da eliminare.
 * @throws {StorageQuotaError} Se il salvataggio della lista aggiornata fallisce per quota.
 */
export function deleteReceipt(id) {
  const receipts = loadReceipts().filter((r) => r.id !== id)
  saveReceipts(receipts)
}

/**
 * Aggiorna i campi di uno scontrino esistente mantenendo l'id invariato.
 *
 * @param {string} id   - Identificatore univoco dello scontrino da aggiornare.
 * @param {Object} data - Campi da sovrascrivere (merge parziale).
 * @throws {StorageQuotaError} Se il salvataggio fallisce per quota.
 */
export function updateReceipt(id, data) {
  const receipts = loadReceipts().map((r) => (r.id === id ? { ...r, ...data, id } : r))
  saveReceipts(receipts)
}

/**
 * Sostituisce l'intera lista di scontrini con quella fornita.
 *
 * @param {Array<Object>} receipts - Nuova lista di scontrini.
 * @throws {StorageQuotaError} Se il salvataggio fallisce per quota.
 */
export function replaceAllReceipts(receipts) {
  saveReceipts(receipts)
}

// ── Settings ──────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  customCategories: [],
}

/**
 * Legge le impostazioni dal localStorage, fondendole con i valori di default.
 *
 * @returns {{ customCategories: Array<Object> }} Oggetto impostazioni.
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch (e) {
    console.warn('[storage] Dati corrotti, usati valori di default:', e.message)
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * Salva le impostazioni nel localStorage.
 *
 * @param {Object} settings - Oggetto impostazioni da persistere.
 * @throws {StorageQuotaError} Se il localStorage ha esaurito la quota disponibile.
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
  } catch (e) {
    throw new StorageQuotaError()
  }
}

// ── Full dump (per export JSON) ───────────────────────────────────────────────

/**
 * Restituisce un dump completo di tutti i dati persistiti (scontrini + impostazioni).
 * Utilizzato per l'esportazione JSON.
 *
 * @returns {{ receipts: Array<Object>, settings: Object }}
 */
export function dumpAll() {
  return {
    receipts: loadReceipts(),
    settings: loadSettings(),
  }
}

/**
 * Ripristina scontrini e impostazioni da un dump precedente.
 * Ignora silenziosamente i campi mancanti o malformati.
 *
 * @param {{ receipts?: Array<Object>, settings?: Object }} dump - Oggetto dump da ripristinare.
 * @throws {StorageQuotaError} Se il salvataggio fallisce per quota.
 */
export function restoreAll({ receipts, settings }) {
  if (Array.isArray(receipts)) saveReceipts(receipts)
  if (settings && typeof settings === 'object') saveSettings(settings)
}