/**
 * Genera un identificatore univoco universale (UUID v4).
 * Usa `crypto.randomUUID()` se disponibile; altrimenti applica un fallback
 * basato su `Math.random()` per browser molto vecchi.
 *
 * @returns {string} UUID v4 nel formato `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback per browser che non supportano crypto.randomUUID (rilasciato ~2021:
  // Chrome 92, Firefox 95, Safari 15.4). Necessario solo per browser molto datati.
  // Gli UUID generati con Math.random() sono statisticamente unici ma NON
  // crittograficamente sicuri (entropia insufficiente). Per questo uso — chiavi
  // locali degli scontrini, mai condivise né usate in contesti di sicurezza —
  // il compromesso è accettabile.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}