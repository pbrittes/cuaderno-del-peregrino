import './Roteiro.css'

import { useState } from 'react'

import { PlusIcon } from '../../components/icons/AppIcons'
import { RoteiroForm } from '../../components/roteiro/RoteiroForm'
import { RoteiroSection } from '../../components/roteiro/RoteiroSection'
import { useAuth } from '../../contexts/AuthContext'
import { useExpedition } from '../../contexts/ExpeditionContext'
import {
  type CreateRoteiroItemInput,
  type RoteiroItem,
  useRoteiroStore,
} from '../../data/roteiroStore'

export function Roteiro() {
  const { user } = useAuth()
  const { expedition } = useExpedition()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] =
    useState<RoteiroItem | null>(null)

  const {
    items,
    loading,
    error,
    addItem,
    updateItem,
    completeItem,
    reopenItem,
    deleteItem,
  } = useRoteiroStore({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  function closeForm() {
    setFormOpen(false)
    setEditingItem(null)
  }

  function handleAdd() {
    setEditingItem(null)
    setFormOpen(true)
  }

  function handleEdit(item: RoteiroItem) {
    setEditingItem(item)
    setFormOpen(true)
  }

  function handleSave(
    formData: CreateRoteiroItemInput,
  ) {
    if (editingItem) {
      updateItem({
        id: editingItem.id,
        status: editingItem.status,
        ...formData,
      })
    } else {
      addItem(formData)
    }

    closeForm()
  }

  return (
    <main className="roteiro-page">
      <header className="roteiro-page-header">
        <button
          type="button"
          className="roteiro-header-add-button"
          aria-label="Adicionar dia ao roteiro"
          onClick={handleAdd}
        >
          <PlusIcon size={20} />
        </button>

        <span>Expedição Santiago 2026</span>

        <h1>Roteiro da viagem</h1>

        <p>
          Visão cronológica dos dias, cidades,
          deslocamentos e pernoites da expedição.
        </p>
      </header>

      {formOpen && (
        <div className="roteiro-form-card">
          <h2>
            {editingItem
              ? 'Editar dia do roteiro'
              : 'Novo dia do roteiro'}
          </h2>

          <RoteiroForm
            item={editingItem}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </div>
      )}

      <RoteiroSection
        items={items}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteItem}
        onComplete={completeItem}
        onReopen={reopenItem}
      />
    </main>
  )
}