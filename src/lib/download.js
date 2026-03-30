/**
 * Scarica un file nel browser creando un link temporaneo.
 * @param {string} content   - Contenuto testuale del file
 * @param {string} filename  - Nome del file da scaricare
 * @param {string} mimeType  - MIME type, es. 'text/csv;charset=utf-8;'
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}