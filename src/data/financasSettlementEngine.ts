import type { Expense, Pilgrim } from './financas'

export type Settlement = {
  from: Pilgrim
  to: Pilgrim
  amount: number
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function getSettlementKey(from: Pilgrim, to: Pilgrim) {
  return `${from}->${to}`
}

function parseSettlementKey(key: string) {
  const [from, to] = key.split('->') as [Pilgrim, Pilgrim]

  return {
    from,
    to,
  }
}

export function calculateSettlements(expenses: Expense[]): Settlement[] {
  const settlementsMap = new Map<string, number>()

  for (const expense of expenses) {
    if (expense.participants.length === 0) continue

    const share = round(expense.amountInBRL / expense.participants.length)

    for (const participant of expense.participants) {
      if (participant === expense.paidBy) continue

      const key = getSettlementKey(participant, expense.paidBy)
      const currentAmount = settlementsMap.get(key) ?? 0

      settlementsMap.set(key, round(currentAmount + share))
    }
  }

  const compensatedMap = new Map<string, Settlement>()

  for (const [key, amount] of settlementsMap.entries()) {
    const { from, to } = parseSettlementKey(key)
    const reverseKey = getSettlementKey(to, from)

    if (compensatedMap.has(key) || compensatedMap.has(reverseKey)) {
      continue
    }

    const reverseAmount = settlementsMap.get(reverseKey) ?? 0
    const netAmount = round(amount - reverseAmount)

    if (Math.abs(netAmount) <= 0.009) {
      continue
    }

    if (netAmount > 0) {
      compensatedMap.set(key, {
        from,
        to,
        amount: netAmount,
      })
    } else {
      compensatedMap.set(reverseKey, {
        from: to,
        to: from,
        amount: Math.abs(netAmount),
      })
    }
  }

  return Array.from(compensatedMap.values()).sort((a, b) => {
    if (a.to !== b.to) {
      return a.to.localeCompare(b.to)
    }

    return a.from.localeCompare(b.from)
  })
}