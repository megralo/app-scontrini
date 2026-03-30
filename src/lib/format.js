/**
 * Formatta un importo numerico come valuta in euro (it-IT).
 * @param {number} value
 * @returns {string} es. "12,50 €"
 */
export function formatEur(value) {
  return (Number(value) || 0).toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' €'
}

/**
 * Formatta una data in formato "YYYY-MM-DD" come "DD/MM/YYYY".
 * Restituisce "—" se la stringa è assente o malformata.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr || !dateStr.includes('-')) return '—'
  const [y, m, d] = dateStr.split('-')
  if (!/^\d+$/.test(y) || !/^\d+$/.test(m) || !/^\d+$/.test(d)) return '—'
  return `${d}/${m}/${y}`
}

/**
 * Restituisce l'etichetta localizzata "mese YYYY" per una stringa "YYYY-MM".
 * @param {string} yearMonth — es. "2024-03"
 * @returns {string} es. "marzo 2024"
 */
export function monthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
}

/**
 * Estrae il prefisso "YYYY-MM" da un oggetto Date.
 * @param {Date} date
 * @returns {string} es. "2024-03"
 */
export function monthPrefix(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}