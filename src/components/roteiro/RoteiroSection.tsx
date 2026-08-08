import { useState } from 'react'

import type { RoteiroItem } from '../../data/roteiroStore'
import { RoteiroCard } from './RoteiroCard'
import { RoteiroForm } from './RoteiroForm'

type RoteiroSectionProps = {
  items: RoteiroItem[]
  loading: boolean
  error: string | null
  onEdit: (item: RoteiroItem) => void
  editingItem?: RoteiroItem | null
  onSaveEdit?: Parameters<typeof RoteiroForm>[0]['onSave']
  onCancelEdit?: () => void
  onDelete: (itemId: string) => void
  onComplete?: (itemId: string) => void
  onReopen?: (itemId: string) => void
}

export function RoteiroSection({
  items,
  loading,
  error,
  onEdit,
  editingItem,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onComplete,
  onReopen,
}: RoteiroSectionProps) {
  const [historyOpen, setHistoryOpen] =
    useState(false)

  const orderedItems = [...items].sort(
    (firstItem, secondItem) => {
      const dateComparison =
        firstItem.date.localeCompare(
          secondItem.date,
        )

      if (dateComparison !== 0) {
        return dateComparison
      }

      return firstItem.city.localeCompare(
        secondItem.city,
        'pt-BR',
      )
    },
  )

  const dayNumbers = new Map(
    orderedItems.map((item, index) => [
      item.id,
      index + 1,
    ]),
  )

  const plannedItems = orderedItems.filter(
    (item) => item.status !== 'completed',
  )

  const completedItems = orderedItems.filter(
    (item) => item.status === 'completed',
  )

  if (loading) {
    return (
      <section className="roteiro-section">
        <p className="roteiro-empty">
          Carregando roteiro...
        </p>
      </section>
    )
  }

  if (orderedItems.length === 0) {
    return (
      <section className="roteiro-section">
        {error && (
          <p className="roteiro-error">
            {error}
          </p>
        )}

        <div className="roteiro-empty-card">
          <strong>
            O roteiro ainda está vazio.
          </strong>

          <span>
            Adicione o primeiro dia da viagem.
          </span>
        </div>
      </section>
    )
  }

  return (
    <section className="roteiro-section">
      {error && (
        <p className="roteiro-error">{error}</p>
      )}

      {plannedItems.length > 0 ? (
        <div className="roteiro-list">
          {plannedItems.map((item) => (
            <div key={item.id}>
              <RoteiroCard
                item={item}
                dayNumber={
                  dayNumbers.get(item.id) ?? 1
                }
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
              />

              {editingItem?.id === item.id &&
                onSaveEdit &&
                onCancelEdit && (
                  <div className="roteiro-form-card">
                    <h2>Editar dia do roteiro</h2>

                    <RoteiroForm
                      item={editingItem}
                      onSave={onSaveEdit}
                      onCancel={onCancelEdit}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      ) : (
        <div className="roteiro-empty-card">
          <strong>
            Todos os dias foram concluídos.
          </strong>

          <span>
            Consulte os dias no histórico.
          </span>
        </div>
      )}

      {completedItems.length > 0 && (
        <div className="roteiro-history">
          <button
            type="button"
            className="roteiro-history-toggle"
            aria-expanded={historyOpen}
            onClick={() =>
              setHistoryOpen(
                (currentValue) =>
                  !currentValue,
              )
            }
          >
            <span>Histórico</span>

            <span>
              {completedItems.length}{' '}
              {completedItems.length === 1
                ? 'dia concluído'
                : 'dias concluídos'}
            </span>

            <span aria-hidden="true">
              {historyOpen ? '−' : '+'}
            </span>
          </button>

          {historyOpen && (
            <div className="roteiro-history-list">
              {completedItems.map((item) => (
                <div key={item.id}>
                  <RoteiroCard
                    item={item}
                    dayNumber={
                      dayNumbers.get(item.id) ?? 1
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReopen={onReopen}
                  />

                  {editingItem?.id === item.id &&
                    onSaveEdit &&
                    onCancelEdit && (
                      <div className="roteiro-form-card">
                        <h2>Editar dia do roteiro</h2>

                        <RoteiroForm
                          item={editingItem}
                          onSave={onSaveEdit}
                          onCancel={onCancelEdit}
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}