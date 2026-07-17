import { useState } from 'react'

import { PilgrimBudgetCard } from '../../components/budget/PilgrimBudgetCard'
import { useAuth } from '../../contexts/AuthContext'
import { useExpedition } from '../../contexts/ExpeditionContext'

import type { Pilgrim } from '../../data/backpacks'
import { useBackpackItems } from '../../data/backpackStore'
import { getBudgetGearItems } from '../../data/orcamentoEngine'
import { useOrcamentoStore } from '../../data/orcamentoStore'

import './Orcamento.css'

const pilgrims: Pilgrim[] = [
  'Pri',
  'Tan',
  'Deia',
]

export function Orcamento() {
  const { user } = useAuth()
  const { expedition } = useExpedition()

  const {
    items,
    loading: backpackLoading,
    error: backpackError,
  } = useBackpackItems({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  const {
    budgetItems,
    loading: budgetLoading,
    error: budgetError,
    saveBudgetItem,
  } = useOrcamentoStore({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  const [selectedPilgrim, setSelectedPilgrim] =
    useState<Pilgrim>('Pri')

  const selectedGearItems =
    getBudgetGearItems(
      items,
      selectedPilgrim,
      budgetItems,
    )

  const loading =
    backpackLoading || budgetLoading

  const error =
    backpackError || budgetError

  return (
    <main className="budget-page">
      <section className="agenda-header">
        <p className="eyebrow">
          Orçamento da Mochila
        </p>

        <h2>
          Planejamento das compras
        </h2>

        <p>
          Acompanhe os valores previstos
          e pagos dos equipamentos de cada
          peregrina.
        </p>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}
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
            onClick={() =>
              setSelectedPilgrim(pilgrim)
            }
          >
            {pilgrim}
          </button>
        ))}
      </section>

      <section className="budget-grid">
        {loading ? (
          <p>
            Carregando orçamento...
          </p>
        ) : (
          <PilgrimBudgetCard
            pilgrim={selectedPilgrim}
            gearItems={
              selectedGearItems
            }
            budgetItems={budgetItems}
            onSave={saveBudgetItem}
          />
        )}
      </section>
    </main>
  )
}