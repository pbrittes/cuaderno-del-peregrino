import type { Expense, Pilgrim } from './financas'

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
}

const pilgrims: Pilgrim[] = ['Pri', 'Tania', 'Andrea']

function round(value: number) {
  return Math.round(value * 100) / 100
}

export function calculateFinanceSummary(
  expenses: Expense[],
): FinanceSummary {
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
  }

  for (const expense of expenses) {
    summary.totalTrip += expense.amountInBRL

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

  return summary
}