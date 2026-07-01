import { useState } from 'react'
import { gearItems, type GearCategory, type GearStatus, type Pilgrim } from '../../data/backpacks'
import { formatKg } from '../../data/backpackEngine'

const pilgrims: Pilgrim[] = ['Pri', 'Tan', 'Deia']

const statusIcon: Record<GearStatus, string> = {
  comprar: '🛒',
  testar: '🧪',
  tem: '✅',
  dispensado: '—',
}

const statusTitle: Record<GearStatus, string> = {
  comprar: 'Comprar',
  testar: 'Testar',
  tem: 'Tenho',
  dispensado: 'Dispensado',
}

function getNextStatus(status: GearStatus): GearStatus {
  if (status === 'comprar') return 'testar'
  if (status === 'testar') return 'tem'
  if (status === 'tem') return 'comprar'
  return 'comprar'
}

export function Mochila() {
  const [items, setItems] = useState(gearItems)
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
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: {
                ...item.status,
                [pilgrim]: getNextStatus(item.status[pilgrim]),
              },
            }
          : item,
      ),
    )
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
          const categoryItems = items.filter((item) => item.category === category)

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
                    <div>
                      <strong>{item.name}</strong>
                    </div>

                    <span className="gear-weight">{formatKg(item.weight)}</span>

                    {pilgrims.map((pilgrim) => (
                      <button
                        key={pilgrim}
                        className={`status-button ${item.status[pilgrim]}`}
                        title={statusTitle[item.status[pilgrim]]}
                        onClick={() => toggleStatus(item.id, pilgrim)}
                      >
                        {statusIcon[item.status[pilgrim]]}
                      </button>
                    ))}
                  </article>
                ))}
            </div>
          )
        })}
      </section>
    </main>
  )
}