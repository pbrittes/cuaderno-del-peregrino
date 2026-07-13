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

  return (
    <main className="budget-page">
      <section className="agenda-header">
        <p className="eyebrow">Orçamento da Mochila</p>

        <h2>Planejamento das compras</h2>

        <p>
          Acompanhe os valores previstos e pagos dos itens marcados para comprar.
        </p>
      </section>

      <section className="budget-grid">
        {pilgrims.map((pilgrim) => (
          <PilgrimBudgetCard
            key={pilgrim}
            pilgrim={pilgrim}
            gearItems={getBudgetGearItems(items, pilgrim)}
            budgetItems={budgetItems}
            onSave={saveBudgetItem}
          />
        ))}
      </section>
    </main>
  )
}