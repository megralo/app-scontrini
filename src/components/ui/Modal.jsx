import { useRef, useEffect } from 'react'

/**
 * Modal riusabile con focus trap, gestione Escape e backdrop click-to-close.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Se true, il modal è visibile
 * @param {function} props.onClose - Callback di chiusura (Escape o click backdrop)
 * @param {string} [props.title] - Testo per aria-label del dialog
 * @param {string} [props.labelledBy] - ID dell'elemento titolo (aria-labelledby)
 * @param {boolean} [props.bottomSheet=false] - Posizionamento bottom-sheet su mobile
 * @param {boolean} [props.scrollable=false] - Abilita scroll verticale nel pannello
 * @param {boolean} [props.closeOnBackdrop=true] - Chiude al click sul backdrop
 * @param {string} [props.className=''] - Classi CSS aggiuntive per il pannello
 * @param {import('react').ReactNode} props.children - Contenuto del modal
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  labelledBy,
  bottomSheet = false,
  scrollable = false,
  closeOnBackdrop = true,
  className = '',
  children,
}) {
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)

  // Blocca lo scroll del body durante l'apertura; ripristina focus al trigger alla chiusura
  useEffect(() => {
    if (!isOpen) return
    triggerRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      triggerRef.current?.focus()
      triggerRef.current = null
    }
  }, [isOpen])

  // Sposta il focus sul primo elemento interattivo all'apertura
  useEffect(() => {
    if (!isOpen) return
    const focusable = dialogRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  }, [isOpen])

  if (!isOpen) return null

  // Focus trap + gestione Escape
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const alignClass = bottomSheet
    ? 'items-end sm:items-center pb-6 sm:pb-0'
    : 'items-center'

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-center bg-black/40 px-4 ${alignClass}`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-labelledby={labelledBy}
        className={`bg-white w-full max-w-md rounded-2xl shadow-xl ${scrollable ? 'max-h-[90vh] overflow-y-auto' : ''} ${className}`}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}