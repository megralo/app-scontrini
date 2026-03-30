import { useState, useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import SearchBar from '../components/history/SearchBar.jsx'
import FilterPanel from '../components/history/FilterPanel.jsx'
import ReceiptCard from '../components/history/ReceiptCard.jsx'
import DeleteConfirmDialog from '../components/history/DeleteConfirmDialog.jsx'
import EditReceiptDialog from '../components/history/EditReceiptDialog.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useColorMap } from '../hooks/useColorMap.js'

export default function History() {
  const { receipts, remove, update, allCategories } = useApp()

  const [search, setSearch]                   = useState('')
  const [selectedCats, setSelectedCats]       = useState([])
  const [dateFrom, setDateFrom]               = useState('')
  const [dateTo, setDateTo]                   = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [editingReceipt, setEditingReceipt]   = useState(null)

  // Mappa nome categoria → colore per lookup rapido
  const colorMap = useColorMap(allCategories)

  const filtered = useMemo(() => {
    return receipts
      .filter((r) => {
        if (search) {
          const q = search.toLowerCase()
          const matchesMerchant = r.merchant.toLowerCase().includes(q)
          const matchesNotes = (r.notes ?? '').toLowerCase().includes(q)
          if (!matchesMerchant && !matchesNotes) return false
        }
        if (selectedCats.length > 0 && !selectedCats.includes(r.category)) return false
        if (dateFrom && r.date < dateFrom) return false
        if (dateTo && r.date > dateTo) return false
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [receipts, search, selectedCats, dateFrom, dateTo])

  const handleDeleteRequest = useCallback((id) => {
    setPendingDeleteId(id)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    remove(pendingDeleteId)
    setPendingDeleteId(null)
  }, [remove, pendingDeleteId])

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null)
  }, [])

  const handleEditRequest = useCallback((receipt) => {
    setEditingReceipt(receipt)
  }, [])

  const handleEditSave = useCallback((data) => {
    update(editingReceipt.id, data)
    setEditingReceipt(null)
  }, [update, editingReceipt])

  const handleEditCancel = useCallback(() => {
    setEditingReceipt(null)
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Storico</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {receipts.length === 0
            ? 'Nessuno scontrino salvato'
            : `${receipts.length} scontrin${receipts.length === 1 ? 'o' : 'i'} salvat${receipts.length === 1 ? 'o' : 'i'}`}
        </p>
      </div>

      {receipts.length > 0 && (
        <>
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            allCategories={allCategories}
            selectedCategories={selectedCats}
            onCategoriesChange={setSelectedCats}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
        </>
      )}

      <div className="flex flex-col gap-2">
        {receipts.length === 0 && (
          <EmptyState
            message="Nessuno scontrino ancora salvato."
            subMessage="Usa la scheda Scansiona per aggiungerne uno."
            className="py-16"
          />
        )}

        {receipts.length > 0 && filtered.length === 0 && (
          <EmptyState
            message="Nessun risultato per i filtri applicati."
            className="py-8"
          />
        )}

        {filtered.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            categoryColor={colorMap[receipt.category]}
            onDelete={handleDeleteRequest}
            onEdit={handleEditRequest}
          />
        ))}
      </div>

      {pendingDeleteId && (
        <DeleteConfirmDialog
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {editingReceipt && (
        <EditReceiptDialog
          receipt={editingReceipt}
          allCategories={allCategories}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  )
}