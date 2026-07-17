import type { ComponentType } from 'react'

import {
  FoodIcon,
  LodgingIcon,
  MarketIcon,
  MoreIcon,
  PharmacyIcon,
  TicketIcon,
  TransportIcon,
} from '../../components/icons/AppIcons'
import { ExpensesSection } from '../../components/finance/ExpensesSection'
import { FinanceSummaryCard } from '../../components/finance/FinanceSummaryCard'
import { SettlementsSection } from '../../components/finance/SettlementsSection'

import { useAuth } from '../../contexts/AuthContext'
import { useExpedition } from '../../contexts/ExpeditionContext'

import type { ExpenseCategory } from '../../data/financas'
import { calculateFinanceSummary } from '../../data/financasEngine'
import { useFinancasStore } from '../../data/financasStore'

import './Financeiro.css'

type CategoryIconComponent = ComponentType<{
  size?: number
  className?: string
  strokeWidth?: number
}>

const categoryColors: Record<ExpenseCategory, string> = {
  alimentacao: '#b2222d',
  hospedagem: '#7c5f3f',
  transporte: '#c28b45',
  compras: '#9aa98f',
  saude: '#66806a',
  ingressos: '#d3b077',
  outros: '#d8cfc3',
}

const categoryIcons: Record<
  ExpenseCategory,
  CategoryIconComponent
> = {
  alimentacao: FoodIcon,
  hospedagem: LodgingIcon,
  transporte: TransportIcon,
  compras: MarketIcon,
  saude: PharmacyIcon,
  ingressos: TicketIcon,
  outros: MoreIcon,
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function buildDonutBackground(
  categories: Array<{
    category: ExpenseCategory
    percentage: number
  }>,
) {
  if (categories.length === 0) {
    return 'conic-gradient(#e8e1d8 0deg 360deg)'
  }

  let currentPercentage = 0

  const segments = categories.map((item) => {
    const start = currentPercentage
    const end =
      currentPercentage + item.percentage

    currentPercentage = end

    return `${categoryColors[item.category]} ${start}% ${end}%`
  })

  if (currentPercentage < 100) {
    segments.push(
      `#e8e1d8 ${currentPercentage}% 100%`,
    )
  }

  return `conic-gradient(${segments.join(', ')})`
}

export function Financeiro() {
  const { user } = useAuth()
  const { expedition } = useExpedition()

  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useFinancasStore({
    userId: user?.id,
    expeditionId: expedition?.id,
  })

  const summary =
    calculateFinanceSummary(expenses)

  const donutBackground =
    buildDonutBackground(summary.categories)

  return (
    <main className="finance-page">
      <section className="finance-header">
        <p className="eyebrow">
          Finanzas del Peregrino
        </p>

        <h2>
          Controle financeiro da expedição
        </h2>

        <p>
          Registre despesas em reais ou euros,
          acompanhe os totais da viagem e facilite
          os acertos entre as peregrinas.
        </p>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}
      </section>

      {loading ? (
        <p>
          Carregando dados financeiros...
        </p>
      ) : (
        <>
          <section className="finance-overview">
            <article className="finance-summary-card finance-total-card">
              <p className="eyebrow finance-card-title">
                Total dos gastos
              </p>

              <div className="finance-chart">
                <div
                  className="finance-donut"
                  style={{
                    background:
                      donutBackground,
                  }}
                  aria-label="Distribuição das despesas por categoria"
                >
                  <div className="finance-donut-center">
                    <small>Total</small>

                    <strong>
                      {formatCurrency(
                        summary.totalTrip,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="finance-chart-legend">
                  {summary.categories.length ===
                  0 ? (
                    <p className="finance-chart-empty">
                      Cadastre despesas para
                      visualizar o resumo.
                    </p>
                  ) : (
                    summary.categories.map(
                      (item) => {
                        const CategoryIcon =
                          categoryIcons[
                            item.category
                          ]

                        return (
                          <div
                            className="finance-chart-legend-item"
                            key={
                              item.category
                            }
                          >
                            <CategoryIcon
                              size={18}
                            />

                            <span
                              className="finance-chart-dot"
                              style={{
                                background:
                                  categoryColors[
                                    item
                                      .category
                                  ],
                              }}
                            />

                            <strong>
                              {formatCurrency(
                                item.total,
                              )}
                            </strong>

                            <small>
                              {item.percentage
                                .toFixed(0)
                                .replace(
                                  '.',
                                  ',',
                                )}
                              %
                            </small>
                          </div>
                        )
                      },
                    )
                  )}
                </div>
              </div>
            </article>

            <SettlementsSection
              expenses={expenses}
            />
          </section>

          <section className="finance-summary-grid">
            <FinanceSummaryCard
              title="Pri"
              paid={
                summary.people.Pri.paid
              }
              consumed={
                summary.people.Pri
                  .consumed
              }
              balance={
                summary.people.Pri
                  .balance
              }
            />

            <FinanceSummaryCard
              title="Tania"
              paid={
                summary.people.Tania.paid
              }
              consumed={
                summary.people.Tania
                  .consumed
              }
              balance={
                summary.people.Tania
                  .balance
              }
            />

            <FinanceSummaryCard
              title="Andrea"
              paid={
                summary.people.Andrea.paid
              }
              consumed={
                summary.people.Andrea
                  .consumed
              }
              balance={
                summary.people.Andrea
                  .balance
              }
            />
          </section>

          <section className="finance-grid">
            <ExpensesSection
              expenses={expenses}
              addExpense={addExpense}
              updateExpense={
                updateExpense
              }
              deleteExpense={
                deleteExpense
              }
            />
          </section>
        </>
      )}
    </main>
  )
}