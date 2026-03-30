/**
 * Badge numerico con colore di sfondo personalizzabile.
 *
 * @param {Object} props
 * @param {string|number} props.label - Testo o numero da mostrare nel badge
 * @param {string} [props.color='bg-blue-600'] - Classe Tailwind per il colore di sfondo
 */
export default function Badge({ label, color = 'bg-blue-600' }) {
  return (
    <span className={`${color} text-white text-xs font-semibold px-1.5 py-0.5 rounded-full leading-none`}>
      {label}
    </span>
  )
}