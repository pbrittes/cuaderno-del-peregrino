import type { GearItem, Pilgrim } from './backpacks'
import type {
  BudgetItem,
  PilgrimBudgetSummary,
} from './orcamento'

export function getBudgetGearItems(
  gearItems: GearItem[],
  pilgrim: Pilgrim,
) {
  return gearItems.filter(
    (item) => item.status[pilgrim] === 'comprar',
  )
}

export function getPilgrimBudgetSummary(
  pilgrim: Pilgrim,
  budgetItems: BudgetItem[],
): PilgrimBudgetSummary {
  const pilgrimItems = budgetItems.filter(
    (item) => item.pilgrim === pilgrim,
  )

  const estimatedTotal = pilgrimItems.reduce(
    (total, item) => total + item.estimatedAmount,
    0,
  )

  const paidTotal = pilgrimItems.reduce(
    (total, item) => total + item.paidAmount,
    0,
  )

  const remainingToSpend = pilgrimItems
    .filter((item) => item.paidAmount <= 0)
    .reduce(
      (total, item) => total + item.estimatedAmount,
      0,
    )

  const savingsTotal = pilgrimItems
    .filter((item) => item.paidAmount > 0)
    .reduce(
      (total, item) =>
        total + (item.estimatedAmount - item.paidAmount),
      0,
    )

  return {
    pilgrim,
    estimatedTotal,
    paidTotal,
    remainingToSpend,
    savingsTotal,
  }
}

export function formatBudgetCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}