import { createContext, useContext, useMemo } from 'react'
import { useReceipts } from '../hooks/useReceipts.js'
import { useSettings } from '../hooks/useSettings.js'

/**
 * Context globale dell'app. Aggrega lo stato di scontrini e impostazioni.
 * Non usare direttamente: accedere tramite `useApp()`.
 *
 * @type {React.Context<Object|null>}
 */
const AppContext = createContext(null)

/**
 * Provider che inizializza `useReceipts` e `useSettings` e ne espone
 * tutte le API come valore di contesto ai componenti figli.
 *
 * Struttura del valore esposto:
 * - **Scontrini:** `receipts`, `add`, `update`, `remove`, `mergeImport`, `replaceAll`
 * - **Impostazioni:** `settings`, `allCategories`, `addCustomCategory`, `removeCustomCategory`, `replaceSettings`
 *
 * @param {Object}         props
 * @param {React.ReactNode} props.children - Albero dei componenti che hanno accesso al context.
 */
export function AppProvider({ children }) {
  const receiptsApi = useReceipts()
  const settingsApi = useSettings()

  const value = useMemo(
    () => ({ ...receiptsApi, ...settingsApi }),
    // Le singole funzioni sono stabili via useCallback negli hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      receiptsApi.receipts,
      receiptsApi.add, receiptsApi.update, receiptsApi.remove,
      receiptsApi.mergeImport, receiptsApi.replaceAll,
      settingsApi.settings, settingsApi.allCategories,
      settingsApi.addCustomCategory, settingsApi.removeCustomCategory,
      settingsApi.replaceSettings,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/**
 * Hook per accedere al context globale dell'app.
 * Deve essere chiamato all'interno di un componente avvolto da `AppProvider`.
 *
 * @returns {{
 *   receipts:             Array<Object>,
 *   add:                  (data: Object) => Object,
 *   update:               (id: string, data: Object) => void,
 *   remove:               (id: string) => void,
 *   mergeImport:          (incoming: Array<Object>) => { added: number, skipped: number },
 *   replaceAll:           (incoming: Array<Object>) => void,
 *   settings:             { customCategories: Array<{ name: string, color: string }> },
 *   allCategories:        Array<{ name: string, color: string, keywords: string[] }>,
 *   addCustomCategory:    (name: string, color: string) => void,
 *   removeCustomCategory: (name: string) => void,
 *   replaceSettings:      (incoming: Object) => void,
 * }}
 * @throws {Error} Se chiamato fuori da `AppProvider`.
 */
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}