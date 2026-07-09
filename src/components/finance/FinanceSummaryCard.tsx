type FinanceSummaryCardProps = {
  title: string
  paid: number
  consumed: number
  balance: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function FinanceSummaryCard({
  title,
  paid,
  consumed,
  balance,
}: FinanceSummaryCardProps) {
  const positive = balance >= 0

  return (
    <article className="finance-summary-card">
      <h3>{title}</h3>

      <div className="finance-summary-values">
        <div>
          <span>Pagou</span>
          <strong>{formatCurrency(paid)}</strong>
        </div>

        <div>
          <span>Consumiu</span>
          <strong>{formatCurrency(consumed)}</strong>
        </div>

        <div>
          <span>{positive ? 'Recebe' : 'Deve'}</span>

          <strong
            className={
              positive
                ? 'finance-balance-positive'
                : 'finance-balance-negative'
            }
          >
            {formatCurrency(Math.abs(balance))}
          </strong>
        </div>
      </div>
    </article>
  )
}