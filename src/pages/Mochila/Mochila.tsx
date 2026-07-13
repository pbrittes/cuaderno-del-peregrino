import { useState } from 'react'
import type { ComponentType } from 'react'

import {
  BootIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
} from '../../components/icons/AppIcons'
import {
  type GearCategory,
  type GearStatus,
  type Pilgrim,
} from '../../data/backpacks'
import { formatKg } from '../../data/backpackEngine'
import { useBackpackItems } from '../../data/backpackStore'

const pilgrims: Pilgrim[] = ['Pri', 'Tan', 'Deia']

type StatusIconComponent = ComponentType<{
  size?: number
  className?: string
  strokeWidth?: number
}>

const statusIcons: Partial<Record<GearStatus, StatusIconComponent>> = {
  comprar: ShoppingCartIcon,
  testar: BootIcon,
  tem: CheckCircleIcon,
}

function getNextStatus(status: GearStatus): GearStatus {
  if (status === 'comprar') return 'testar'
  if (status === 'testar') return 'tem'
  if (status === 'tem') return 'comprar'
  return 'comprar'
}

function itemLabel(name: string, quantity: number) {
  return quantity > 1 ? `${quantity} × ${name}` : name
}

function renderStatusIcon(status: GearStatus, size: number) {
  const StatusIcon = statusIcons[status]

  if (!StatusIcon) {
    return <span aria-hidden="true">—</span>
  }

  return <StatusIcon size={size} />
}

export function Mochila() {
  const { items, updateStatus } = useBackpackItems()

  const [openCategories, setOpenCategories] = useState<GearCategory[]>([
    'mochila',
    'calçado',
    'roupa',
    'dormir',
    'higiene',
    'saúde',
    'eletrônicos',
    'acessórios',
  ])

  const categories = Array.from(new Set(items.map((item) => item.category)))

  function toggleStatus(itemId: string, pilgrim: Pilgrim) {
    const item = items.find((currentItem) => currentItem.id === itemId)

    if (!item) return

    updateStatus(itemId, pilgrim, getNextStatus(item.status[pilgrim]))
  }

  function toggleCategory(category: GearCategory) {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    )
  }

  return (
    <main className="mochila-page">
      <section className="agenda-header">
        <p className="eyebrow">Mochilas</p>
        <h2>Checklist da expedição</h2>
        <p>Um clique muda o status: comprar → testar → tenho.</p>
      </section>

      <section className="gear-table">
        <div className="gear-table-header">
          <span>Item</span>
          <span>Peso</span>

          {pilgrims.map((pilgrim) => (
            <span key={pilgrim}>{pilgrim}</span>
          ))}
        </div>

        {categories.map((category) => {
          const isOpen = openCategories.includes(category)
          const categoryItems = items.filter(
            (item) => item.category === category,
          )

          return (
            <div key={category} className="gear-category">
              <button
                className="gear-category-title"
                onClick={() => toggleCategory(category)}
              >
                <span>{isOpen ? '▾' : '▸'}</span>
                {category}
              </button>

              {isOpen &&
                categoryItems.map((item) => (
                  <article className="gear-table-row" key={item.id}>
                    <div className="gear-item-info">
                      <strong>{itemLabel(item.name, item.quantity)}</strong>
                      <small>{formatKg(item.weight)}</small>
                    </div>

                    <span className="gear-weight">{formatKg(item.weight)}</span>

                    <div className="gear-mobile-statuses">
                      {pilgrims.map((pilgrim) => {
                        const status = item.status[pilgrim]

                        return (
                          <button
                            key={pilgrim}
                            className={`status-button ${status}`}
                            onClick={() => toggleStatus(item.id, pilgrim)}
                            title={`${pilgrim}: ${status}`}
                            aria-label={`${pilgrim}: ${status}`}
                          >
                            <span>{pilgrim}</span>
                            <strong>
                              {renderStatusIcon(status, 20)}
                            </strong>
                          </button>
                        )
                      })}
                    </div>

                    {pilgrims.map((pilgrim) => {
                      const status = item.status[pilgrim]

                      return (
                        <button
                          key={pilgrim}
                          className={`status-button desktop-status ${status}`}
                          onClick={() => toggleStatus(item.id, pilgrim)}
                          title={`${pilgrim}: ${status}`}
                          aria-label={`${pilgrim}: ${status}`}
                        >
                          {renderStatusIcon(status, 20)}
                        </button>
                      )
                    })}
                  </article>
                ))}
            </div>
          )
        })}
      </section>
    </main>
  )
}