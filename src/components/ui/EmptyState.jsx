/**
 * Stato vuoto generico: messaggio centrato con sottotitolo e azione opzionali.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.icon] - Icona da mostrare sopra il messaggio
 * @param {string} props.message - Testo principale
 * @param {string} [props.subMessage] - Testo secondario
 * @param {string} [props.className=''] - Classi CSS aggiuntive (es. 'py-16')
 * @param {import('react').ReactNode} [props.children] - Elemento aggiuntivo (es. bottone azione)
 */
export default function EmptyState({ icon, message, subMessage, className = '', children }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {icon && <div aria-hidden="true">{icon}</div>}
      <p className="text-gray-400 text-sm">{message}</p>
      {subMessage && <p className="text-gray-400 text-xs">{subMessage}</p>}
      {children}
    </div>
  )
}