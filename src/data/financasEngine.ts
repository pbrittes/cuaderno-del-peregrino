import type {
  Expense,
  ExpenseCategory,
  Pilgrim,
} from './financas'

export type FinanceCategorySummary = {
  category: ExpenseCategory
  total: number
  percentage: number
}

export type FinanceSummary = {
  totalTrip: number

  people: Record<
    Pilgrim,
    {
      paid: number
      consumed: number
      balance: number
    }
  >

  categories: FinanceCategorySummary[]
}

const pilgrims: Pilgrim[] = ['Pri', 'Tania', 'Andrea']

const categories: ExpenseCategory[] = [
  'alimentacao',
  'hospedagem',
  'transporte',
  'compras',
  'saude',
  'ingressos',
  'outros',
]

function round(value: number) {
  return Math.round(value * 100) / 100
}

export function calculateFinanceSummary(
  expenses: Expense[],
): FinanceSummary {
  const categoryTotals: Record<ExpenseCategory, number> = {
    alimentacao: 0,
    hospedagem: 0,
    transporte: 0,
    compras: 0,
    saude: 0,
    ingressos: 0,
    outros: 0,
  }

  const summary: FinanceSummary = {
    totalTrip: 0,

    people: {
      Pri: {
        paid: 0,
        consumed: 0,
        balance: 0,
      },

      Tania: {
        paid: 0,
        consumed: 0,
        balance: 0,
      },

      Andrea: {
        paid: 0,
        consumed: 0,
        balance: 0,
      },
    },

    categories: [],
  }

  for (const expense of expenses) {
    summary.totalTrip += expense.amountInBRL
    categoryTotals[expense.category] += expense.amountInBRL

    summary.people[expense.paidBy].paid += expense.amountInBRL

    const share =
      expense.participants.length === 0
        ? 0
        : expense.amountInBRL / expense.participants.length

    for (const participant of expense.participants) {
      summary.people[participant].consumed += share
    }
  }

  for (const pilgrim of pilgrims) {
    summary.people[pilgrim].paid = round(
      summary.people[pilgrim].paid,
    )

    summary.people[pilgrim].consumed = round(
      summary.people[pilgrim].consumed,
    )

    summary.people[pilgrim].balance = round(
      summary.people[pilgrim].paid -
        summary.people[pilgrim].consumed,
    )
  }

  summary.totalTrip = round(summary.totalTrip)

  summary.categories = categories
    .map((category) => {
      const total = round(categoryTotals[category])

      return {
        category,
        total,
        percentage:
          summary.totalTrip === 0
            ? 0
            : round((total / summary.totalTrip) * 100),
      }
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.total - a.total)

  return summary
}