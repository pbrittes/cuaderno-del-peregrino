import type {
  GearItem,
  Pilgrim,
} from './backpacks'
import type {
  BudgetItem,
  PilgrimBudgetSummary,
} from './orcamento'

function hasBudgetData(
  budgetItems: BudgetItem[],
  gearItemId: string,
  pilgrim: Pilgrim,
) {
  const budgetItem = budgetItems.find(
    (item) =>
      item.gearItemId === gearItemId &&
      item.pilgrim === pilgrim,
  )

  if (!budgetItem) {
    return false
  }

  return (
    budgetItem.estimatedAmount > 0 ||
    budgetItem.paidAmount > 0 ||
    budgetItem.notes.trim().length > 0
  )
}

export function getBudgetGearItems(
  gearItems: GearItem[],
  pilgrim: Pilgrim,
  budgetItems: BudgetItem[],
) {
  return gearItems.filter((item) => {
    const status = item.status[pilgrim]

    if (status === 'comprar') {
      return true
    }

    if (status === 'tem') {
      return hasBudgetData(
        budgetItems,
        item.id,
        pilgrim,
      )
    }

    return false
  })
}

export function getPendingBudgetItemsCount(
  gearItems: GearItem[],
  pilgrim: Pilgrim,
) {
  return gearItems.filter(
    (item) => item.status[pilgrim] === 'comprar',
  ).length
}

export function getPilgrimBudgetSummary(
  pilgrim: Pilgrim,
  gearItems: GearItem[],
  budgetItems: BudgetItem[],
): PilgrimBudgetSummary {
  const visibleGearItemIds = new Set(
    gearItems.map((item) => item.id),
  )

  const pilgrimItems = budgetItems.filter(
    (item) =>
      item.pilgrim === pilgrim &&
      visibleGearItemIds.has(item.gearItemId),
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
        total +
        (item.estimatedAmount - item.paidAmount),
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