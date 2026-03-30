import { useApp } from '../context/AppContext.jsx'
import CustomCategoryForm from '../components/settings/CustomCategoryForm.jsx'
import CategoryList from '../components/settings/CategoryList.jsx'
import ExportSection from '../components/settings/ExportSection.jsx'
import ImportSection from '../components/settings/ImportSection.jsx'
import SectionCard from '../components/ui/SectionCard.jsx'

export default function Settings() {
  const {
    receipts,
    allCategories,
    settings,
    addCustomCategory,
    removeCustomCategory,
    mergeImport,
    replaceAll,
    replaceSettings,
  } = useApp()

  const existingNames      = allCategories.map((c) => c.name)
  const customCategoryNames = settings.customCategories.map((c) => c.name)

  // Merge: unisce solo gli scontrini, non tocca le impostazioni locali
  function handleMerge(incomingReceipts) {
    return mergeImport(incomingReceipts)
  }

  // Sostituisci tutto: rimpiazza scontrini e impostazioni
  function handleReplace(incomingReceipts, incomingSettings) {
    replaceAll(incomingReceipts)
    if (incomingSettings && typeof incomingSettings === 'object') {
      replaceSettings(incomingSettings)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-500 mt-1 text-sm">Categorie, export e import</p>
      </div>

      <SectionCard title="Categorie">
        <CustomCategoryForm
          onAdd={addCustomCategory}
          existingNames={existingNames}
        />
        <div className="border-t border-gray-100 -mx-4 px-4 pt-3">
          <CategoryList
            allCategories={allCategories}
            customCategoryNames={customCategoryNames}
            onRemove={removeCustomCategory}
          />
        </div>
      </SectionCard>

      <SectionCard title="Esporta dati">
        <ExportSection receipts={receipts} />
      </SectionCard>

      <SectionCard title="Importa dati">
        <ImportSection onMerge={handleMerge} onReplace={handleReplace} />
      </SectionCard>
    </div>
  )
}