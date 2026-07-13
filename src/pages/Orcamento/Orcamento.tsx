import { useState } from 'react'

import { PilgrimBudgetCard } from '../../components/budget/PilgrimBudgetCard'
import { useBackpackItems } from '../../data/backpackStore'
import { getBudgetGearItems } from '../../data/orcamentoEngine'
import { useOrcamentoStore } from '../../data/orcamentoStore'
import type { Pilgrim } from '../../data/backpacks'

import './Orcamento.css'

const pilgrims: Pilgrim[] = ['Pri', 'Tan', 'Deia']

export function Orcamento() {
  const { items } = useBackpackItems()
  const { budgetItems, saveBudgetItem } = useOrcamentoStore()

  const [selectedPilgrim, setSelectedPilgrim] =
    useState<Pilgrim>('Pri')

  const selectedGearItems = getBudgetGearItems(
    items,
    selectedPilgrim,
    budgetItems,
  )

  return (
    <main className="budget-page">
      <section className="agenda-header">
        <p className="eyebrow">Orçamento da Mochila</p>

        <h2>Planejamento das compras</h2>

        <p>
          Acompanhe os valores previstos e pagos dos equipamentos de cada
          peregrina.
        </p>
      </section>

      <section className="budget-pilgrim-selector">
        {pilgrims.map((pilgrim) => (
          <button
            key={pilgrim}
            type="button"
            className={
              selectedPilgrim === pilgrim
                ? 'budget-pilgrim-tab active'
                : 'budget-pilgrim-tab'
            }
            onClick={() => setSelectedPilgrim(pilgrim)}
          >
            {pilgrim}
          </button>
        ))}
      </section>

      <section className="budget-grid">
        <PilgrimBudgetCard
          pilgrim={selectedPilgrim}
          gearItems={selectedGearItems}
          budgetItems={budgetItems}
          onSave={saveBudgetItem}
        />
      </section>
    </main>
  )
}