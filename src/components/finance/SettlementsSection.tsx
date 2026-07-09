import { calculateSettlements } from '../../data/financasSettlementEngine'
import type { Expense } from '../../data/financas'

type SettlementsSectionProps = {
  expenses: Expense[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function SettlementsSection({
  expenses,
}: SettlementsSectionProps) {
  const settlements = calculateSettlements(expenses)

  return (
    <section className="finance-section">
      <div className="section-header">
        <p className="eyebrow">Acertos Financeiros</p>
      </div>

      {settlements.length === 0 ? (
        <div className="empty-state">
          <p>Todas as contas estão acertadas. 🎉</p>
        </div>
      ) : (
        <div className="expenses-list">
          {settlements.map((settlement, index) => (
            <div key={index} className="expense-placeholder">
              <strong>
                {settlement.from} → {settlement.to}
              </strong>

              <div>{formatCurrency(settlement.amount)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}