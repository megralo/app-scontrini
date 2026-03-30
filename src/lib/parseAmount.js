/**
 * Converte una stringa importo in numero, gestendo sia il formato italiano
 * (1.234,56) che internazionale (1,234.56) e semplice decimale (1234.56).
 */
export function parseAmount(str) {
  if (typeof str !== 'string') return parseFloat(str)
  const s = str.trim()
  if (s.includes('.') && s.includes(',')) {
    const lastDot   = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    if (lastComma > lastDot) {
      // italiano: 1.234,56
      return parseFloat(s.replace(/\./g, '').replace(',', '.'))
    } else {
      // internazionale: 1,234.56
      return parseFloat(s.replace(/,/g, ''))
    }
  }
  if (s.includes(',')) return parseFloat(s.replace(',', '.'))
  return parseFloat(s)
}