import type {
  BudgetItem,
  BudgetItemData,
} from '../../data/orcamento'
import type {
  GearItem,
  Pilgrim,
} from '../../data/backpacks'
import {
  formatBudgetCurrency,
  getPilgrimBudgetSummary,
} from '../../data/orcamentoEngine'

type PilgrimBudgetCardProps = {
  pilgrim: Pilgrim
  gearItems: GearItem[]
  budgetItems: BudgetItem[]
  onSave: (item: BudgetItemData) => void
}

function getBudgetItem(
  budgetItems: BudgetItem[],
  gearItemId: string,
  pilgrim: Pilgrim,
) {
  return budgetItems.find(
    (item) =>
      item.gearItemId === gearItemId &&
      item.pilgrim === pilgrim,
  )
}

export function PilgrimBudgetCard({
  pilgrim,
  gearItems,
  budgetItems,
  onSave,
}: PilgrimBudgetCardProps) {
  const summary = getPilgrimBudgetSummary(
    pilgrim,
    budgetItems,
  )

  function updateBudgetItem(
    gearItemId: string,
    field: 'estimatedAmount' | 'paidAmount' | 'notes',
    value: number | string,
  ) {
    const currentItem = getBudgetItem(
      budgetItems,
      gearItemId,
      pilgrim,
    )

    onSave({
      gearItemId,
      pilgrim,
      estimatedAmount:
        field === 'estimatedAmount'
          ? Number(value)
          : currentItem?.estimatedAmount ?? 0,
      paidAmount:
        field === 'paidAmount'
          ? Number(value)
          : currentItem?.paidAmount ?? 0,
      notes:
        field === 'notes'
          ? String(value)
          : currentItem?.notes ?? '',
    })
  }

  return (
    <article className="budget-pilgrim-card">
      <div className="budget-pilgrim-header">
        <div>
          <p className="eyebrow">Orçamento individual</p>
          <h3>{pilgrim}</h3>
        </div>

        <span>
          {gearItems.length}{' '}
          {gearItems.length === 1
            ? 'item para comprar'
            : 'itens para comprar'}
        </span>
      </div>

      {gearItems.length === 0 ? (
        <div className="budget-empty-state">
          <p>Nenhum item marcado para comprar.</p>
        </div>
      ) : (
        <div className="budget-items-list">
          {gearItems.map((gearItem) => {
            const budgetItem = getBudgetItem(
              budgetItems,
              gearItem.id,
              pilgrim,
            )

            return (
              <div
                className="budget-item-row"
                key={`${pilgrim}-${gearItem.id}`}
              >
                <div className="budget-item-name">
                  <strong>
                    {gearItem.quantity > 1
                      ? `${gearItem.quantity} × ${gearItem.name}`
                      : gearItem.name}
                  </strong>

                  <small>{gearItem.category}</small>
                </div>

                <label className="budget-field">
                  <span>Previsto</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      budgetItem?.estimatedAmount || ''
                    }
                    onChange={(event) =>
                      updateBudgetItem(
                        gearItem.id,
                        'estimatedAmount',
                        event.target.value,
                      )
                    }
                    placeholder="0,00"
                  />
                </label>

                <label className="budget-field">
                  <span>Pago</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={budgetItem?.paidAmount || ''}
                    onChange={(event) =>
                      updateBudgetItem(
                        gearItem.id,
                        'paidAmount',
                        event.target.value,
                      )
                    }
                    placeholder="0,00"
                  />
                </label>

                <label className="budget-field budget-notes-field">
                  <span>Observações</span>

                  <input
                    type="text"
                    value={budgetItem?.notes ?? ''}
                    onChange={(event) =>
                      updateBudgetItem(
                        gearItem.id,
                        'notes',
                        event.target.value,
                      )
                    }
                    placeholder="Opcional"
                  />
                </label>
              </div>
            )
          })}
        </div>
      )}

      <div className="budget-summary">
        <div>
          <span>Total previsto</span>
          <strong>
            {formatBudgetCurrency(summary.estimatedTotal)}
          </strong>
        </div>

        <div>
          <span>Total pago</span>
          <strong>
            {formatBudgetCurrency(summary.paidTotal)}
          </strong>
        </div>

        <div className="budget-summary-remaining">
          <span>Falta gastar</span>
          <strong>
            {formatBudgetCurrency(summary.remainingToSpend)}
          </strong>
        </div>

        <div className="budget-summary-savings">
          <span>Economia</span>
          <strong>
            {formatBudgetCurrency(summary.savingsTotal)}
          </strong>
        </div>
      </div>
    </article>
  )
}