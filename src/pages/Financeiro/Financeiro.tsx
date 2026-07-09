import { ExpensesSection } from '../../components/finance/ExpensesSection'
import { FinanceSummaryCard } from '../../components/finance/FinanceSummaryCard'
import { SettlementsSection } from '../../components/finance/SettlementsSection'

import { useFinancasStore } from '../../data/financasStore'
import { calculateFinanceSummary } from '../../data/financasEngine'

import './Financeiro.css'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function Financeiro() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useFinancasStore()

  const summary = calculateFinanceSummary(expenses)

  return (
    <main className="finance-page">
      <section className="finance-header">
        <p className="eyebrow">Finanzas del Peregrino</p>

        <h2>Controle financeiro da expedição</h2>

        <p>
          Registre despesas em reais ou euros, acompanhe os totais da viagem
          e facilite os acertos entre as peregrinas.
        </p>
      </section>

      <section className="finance-overview">
        <article className="finance-summary-card finance-total-card">
          <span>Total da viagem</span>

          <strong>{formatCurrency(summary.totalTrip)}</strong>
        </article>

        <SettlementsSection expenses={expenses} />
      </section>

      <section className="finance-summary-grid">
        <FinanceSummaryCard
          title="Pri"
          paid={summary.people.Pri.paid}
          consumed={summary.people.Pri.consumed}
          balance={summary.people.Pri.balance}
        />

        <FinanceSummaryCard
          title="Tania"
          paid={summary.people.Tania.paid}
          consumed={summary.people.Tania.consumed}
          balance={summary.people.Tania.balance}
        />

        <FinanceSummaryCard
          title="Andrea"
          paid={summary.people.Andrea.paid}
          consumed={summary.people.Andrea.consumed}
          balance={summary.people.Andrea.balance}
        />
      </section>

      <section className="finance-grid">
        <ExpensesSection
          expenses={expenses}
          addExpense={addExpense}
          updateExpense={updateExpense}
          deleteExpense={deleteExpense}
        />
      </section>
    </main>
  )
}